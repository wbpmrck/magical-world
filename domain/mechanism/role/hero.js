/**
 * Created by kaicui on 17/8/22.
 * 表示战场上的一个英雄
 *
 * 注意：
 * 1、hero被添加到一个team之后，可能会被注入一些属性，比如team属性
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const Levelable = require("../../level/levelable");
const {SkillType} = require("../../skill/skill");
const {getRaceCamp} = require("./camp");
const {getJob} = require("./job");
const {Star} = require("./star");
const {injectHeroAttributes,HeroBaseAttributes,HeroDeriveAttributes,HeroOtherAttributes} = require("./attributeRule");
const  statusEnum = require("../../effect/implement/statusEnum");

const HeroEvents=require("../lifeCycle").HeroEvents;


let Hero = oop.defineClass({
    super:Levelable,
    constructor:function({
        levelCur, //number,或者Integer 对象，表示当前等级
        levelMax, //number,或者Integer 对象，表示最高等级
        exp, // number,表示当前获得的经验值
        expTableName="small_03", // String，表示经验值增长曲线名称
    },{
        id,//英雄id
        name,//英雄名称
        raceCampCode, //种族&阵营编号
        jobCode, //职业编号
        starLevel,//number,星数
        skills,//数组，英雄具有的技能列表。0是普通攻击技能，1是主动技能
    
        context,//hero所处的上下文，hero身上的效果，依靠这种上下文来获取外部世界的事件
        rawAttributes, //属性对象，包含需要持久化的所有角色属性数据。如：str,agi,vit,int,dex,luk,hp,sp等
    }){
        var self = this;
        self.id = id;
        self.name = name;
        self.context = context;//hero所处的上下文，hero身上的效果，依靠这种上下文来获取外部世界的事件
        //6项基本属性的初始化，以及对应的附加属性初始化
        injectHeroAttributes(self,rawAttributes);
        
        self.camp = getRaceCamp(raceCampCode);//种族&阵营
        self.job = getJob(jobCode);//职业
        self.star = new Star(starLevel);//星级
        
        self.skills = skills;
    
        self.skills&&self.skills.forEach((sk)=>{
            sk.holder = self;
            if(sk.type === SkillType.PASSIVE){
                sk.release(self.context); //立刻释放被动技能
            }
        })
        
        self.isDead = false;//是否已死亡
        
        //检测hp变化，如果到0，且当前没有重生效果，会发射死亡事件
        self.on("attrChange",(attr,total,raw,modify,val)=>{
           if(attr.name===HeroOtherAttributes.HP){
               if(total<=0){
                   self.emit(HeroEvents.BEFORE_HERO_DIE);
    
                   //设置死亡标记
                   self.isDead = true;
    
                   self.emit(HeroEvents.AFTER_HERO_DIE);
               }else{
                   //设置死亡标记
                   self.isDead = false;
               }
           }
        });
        
        // self.vital = vital;//精气点数
        
    },
    prototype:{
        
        toString:function () {
          return `${this.name}:[${this.id}],hp:[${this.getAttr(HeroOtherAttributes.HP).getVal()}/${this.getAttr(HeroDeriveAttributes.HP_MAX).getVal()}]`
        },
    
        /**
         * 判断自身是否完全死透了（hp<0 并且没有被标记重生效果）
         * @returns {boolean}
         */
        isCompleteDead:function () {
            var self = this;
    
            if(self.getAttr(HeroOtherAttributes.HP).getVal()>0 || self.hasEffect("reborn")){
                return false;
            }else{
                return true;
            }
          
        },
      
        /** todo:拷贝出一个自身的副本。这副本所处的context可以是一个全新的上下文
         * 副本：包含的基本属性、装备与本体是关联的，含部分自定义信息，包括：
         * hp值，怒气，效果列表等
         */
        copy:function (newContext) {
            var self = this;
            
            
        },
    
        /**
         * 角色是否可以进行行动
         * @returns {boolean}
         */
        canAction:function () {
            var self = this;
            
            //默认是可以行动的
            let can = true;
            
            //判断自身的效果列表里，是否还有眩晕、冰冻效果
            let statusEffects = self.getEffect(function (ef) {
                return ef.name ==='Status' && ef.params.stopAction===true
            });
            
            if(statusEffects && statusEffects.length > 0){
                can = false;
            }
            
            return can;
        },
        //hero触发一个主动行为，比如普通攻击，或者技能攻击
        startAction:function () {
            var self = this;
            let skillIndex = 0; //默认是普通攻击（0技能）
            /*
                1.获取自己怒气值，如果满了，则触发1技能
             */
            if(self.getAttr(HeroOtherAttributes.SP).getVal()>=self.getAttr(HeroOtherAttributes.SP_MAX).getVal()){
                skillIndex = 1;
            }
            //释放技能（注意普通攻击也被当做技能处理，固定为0技能）
            self.releaseSkill(skillIndex);
            
            //注意，释放技能之后，释放者增加怒气值等，这些操作，全部在对应effect的逻辑里实现。
            
        },
        /**
         * 让英雄立刻释放某个技能
         *
         * 注意：这个方法不产生
         * @param index
         */
        releaseSkill:function (index) {
            var self = this;
            let skillToRelease = self.skills[index];
            
            self.emit(HeroEvents.BEFORE_ACTION,skillToRelease);
            
            skillToRelease.release(self.context); //释放技能
            
            self.emit(HeroEvents.AFTER_ACTION,skillToRelease);
        },
        //todo:hero 接收一个修改请求，比如修改Hp等
        takeMutation:function (mutation) {
            
        },
    
        /**
         * 加入队伍
         * @param team
         * @returns {Hero}
         */
        joinTeam:function (team) {
            this.team = team;
            return this;
        }
    }
});

module.exports = {Hero,HeroEvents};

