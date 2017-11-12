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
const logger = require('../../../log/logger');
const HeroEvents=require("../lifeCycle").HeroEvents;


const SP_ADD_PER_EFFECT =20 ;//每次普通攻击之后，增加10点sp

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
    
       
        self.isDead = self.getAttr(HeroOtherAttributes.HP).getVal()===0;//是否已死亡
        
        if(self.isDead){
            //死亡时，能量丢失(设置未0)
            self.getAttr(HeroOtherAttributes.SP).updateAddPercent(-1);
        }
        
        //检测hp变化，如果到0，且当前没有重生效果，会发射死亡事件
        self.on("attrChange",(attr,total,raw,modify,val,oldTotal)=>{
           if(attr.name===HeroOtherAttributes.HP){
               if(total<=0){
                   self.emit(HeroEvents.BEFORE_HERO_DIE);
    
                   
                   logger.debug(`英雄死亡:[${self}]`);
                   //设置死亡标记
                   self.isDead = true;
                   
                   //死亡时，能量丢失(设置未0)
                   self.getAttr(HeroOtherAttributes.SP).updateAddPercent(-1);
    
                   self.emit(HeroEvents.AFTER_HERO_DIE);
               }else{
                   if(oldTotal<=0){
                       logger.debug(`英雄复活:[${self}]`);
                       self.emit(HeroEvents.BEFORE_HERO_REBORN);
                       //设置死亡标记
                       self.isDead = false;
                       self.emit(HeroEvents.AFTER_HERO_REBORN);
                   }
               }
           }
        });
        
        // self.vital = vital;//精气点数
        
    },
    prototype:{
    
        /**
         * 将对象内容完全转化为不附带循环引用的纯对象
         * @param serializeLevel:决定序列化英雄信息的数量和程度
         */
        toJSONObject:function ({serializeLevel}) {
            var self = this;
            if(serializeLevel === 1){
                return {
                    id:self.id,
                    name:self.name,
                    level:self.levelCur.getVal(),
                    camp:self.camp,
                    job:self.job,
                    star:self.star.level,
                    attrMap:{
                        [HeroOtherAttributes.HP]:self.getAttr(HeroOtherAttributes.HP).getVal(),
                        [HeroDeriveAttributes.HP_MAX]:self.getAttr(HeroDeriveAttributes.HP_MAX).getVal(),
                        [HeroOtherAttributes.SP]:self.getAttr(HeroOtherAttributes.SP).getVal(),
                        [HeroOtherAttributes.SP_MAX]:self.getAttr(HeroOtherAttributes.SP_MAX).getVal()
                    }
                }
            }
        },
        /**
         * 显示英雄详细信息
         * @param detail
         * @returns {string}
         */
        toString:function (detail) {
            if(!detail){
                return `${this.name}:[${this.id}],hp:[${this.getAttr(HeroOtherAttributes.HP).getVal()}/${this.getAttr(HeroDeriveAttributes.HP_MAX).getVal()}],sp:[${this.getAttr(HeroOtherAttributes.SP).getVal()}/${this.getAttr(HeroOtherAttributes.SP_MAX).getVal()}],SPD:[${this.getAttr(HeroDeriveAttributes.SPD).getVal()}]`
            }else{
                return `
                ${this.name}:[${this.id}]:\r\n
                hp:[${this.getAttr(HeroOtherAttributes.HP).getVal()}/${this.getAttr(HeroDeriveAttributes.HP_MAX).getVal()}],
                sp:[${this.getAttr(HeroOtherAttributes.SP).getVal()}/${this.getAttr(HeroOtherAttributes.SP_MAX).getVal()}],
                SPD:[${this.getAttr(HeroDeriveAttributes.SPD).getVal()}],
                CRI:[${this.getAttr(HeroDeriveAttributes.CRI).getVal()}],
                HIT:[${this.getAttr(HeroDeriveAttributes.HIT).getVal()}],
                FLEE:[${this.getAttr(HeroDeriveAttributes.FLEE).getVal()}],
                ATK:[${this.getAttr(HeroDeriveAttributes.ATK).getVal()}],
                DEF:[${this.getAttr(HeroDeriveAttributes.DEF).getVal()}],
                M_ATK:[${this.getAttr(HeroDeriveAttributes.M_ATK).getVal()}],
                M_DEF:[${this.getAttr(HeroDeriveAttributes.M_DEF).getVal()}],
                `
            }
          
        },
    
        /**
         * 将英雄绑定到玩家对象，开始英雄生命周期
         * @param player
         */
        initOnPlayer:function (player) {
            var self = this;
            
            self.context = player;
            
            self.skills&&self.skills.forEach((sk)=>{
                sk.holder = self;
                if(sk.type === SkillType.PASSIVE){
            
                    logger.debug(`准备释放[${self.toString()}]的被动技能,context=${self.context}`);
                    sk.release(self.context); //立刻释放被动技能
                    logger.debug(`完成释放[${self.toString()}]的被动技能,context=${self.context}`);
                }
            });
            
            return self;
    
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
         * 当前是否可以放大招
         * @returns {boolean}
         */
        canBigSkill:function () {
            var self = this;
            let can = self.getAttr(HeroOtherAttributes.SP).getVal()>=self.getAttr(HeroOtherAttributes.SP_MAX).getVal();
    
            //判断自身的效果列表里，是否存在封印效果
            let statusEffects = self.getEffect(function (ef) {
                return ef.name ==='Status' && ef.params.stopSkill===true
            });
            if(statusEffects && statusEffects.length > 0){
                can = false;
            }
            return can;
        },
    
        /**
         * 角色是否可以进行行动
         * @returns {boolean}
         */
        canAction:function () {
            var self = this;
            
            //默认活着的是可以行动的
            let can = !self.isDead;
            
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
                如果满足大招要求（怒气、无封印)，则触发1技能
             */
            // if(self.getAttr(HeroOtherAttributes.SP).getVal()>=self.getAttr(HeroOtherAttributes.SP_MAX).getVal()){
            if(self.canBigSkill()){
                logger.debug(`[${self}]，准备发动主动技能!`)
                skillIndex = 1;
            }
            //释放技能（注意普通攻击也被当做技能处理，固定为0技能）
            self.releaseSkill(skillIndex);
            
            //注意，释放1技能之后，怒气值清空。否则增加怒气
            if(skillIndex===0){
                //获得怒气
                self.takeMutation({
                    from:self,
                    mutation:{
                        [HeroOtherAttributes.SP]:SP_ADD_PER_EFFECT
                    }
                });
            }else{
                //怒气清空
                self.takeMutation({
                    from:self,
                    mutation:{
                        [HeroOtherAttributes.SP]: 0-self.getAttr(HeroOtherAttributes.SP).getVal()
                    }
                });
            }
            
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
        /**
         * 接收一个属性集合修改请求（注意，这里的修改，是一次性修改，而不是modify）
         * @param from:修改来源effect对象
         * @param remark:本次改动的备注，用于配合数据展示一些备注信息
         * @param mutation：key:attrName  value:changeNum (+代表增加  -代表减少)
         */
        takeMutation:function ({from,mutation,remark}) {
            var self = this;
            logger.debug(`[${self.toString()}]准备接收mutation:${JSON.stringify(mutation)}`);
    
            self.emit(HeroEvents.BEFORE_MUTATION,from,mutation,remark);
            
            let mutationResult = {};//key:attrName value:value after mutation
            //对每一个要修改的属性,进行修改
            for(var attName in mutation){
                self.getAttr(attName).updateAdd(mutation[attName]);
                mutationResult[attName]=self.getAttr(attName).getVal();
            }
            self.emit(HeroEvents.AFTER_MUTATION,from,mutation,remark,mutationResult);
            
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

