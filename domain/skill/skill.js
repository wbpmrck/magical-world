/**
 * Created by kaicui on 17/8/7.
 *
 * 技能：
 *
 * 1、技能包含多个技能项目，技能定义了所属人，等级、当前熟练度（经验）等信息。
 *      技能还有一个关键属性type,表示主动还是被动。如果是被动技能，则人物创建完成之后就触发release.主动技能的release由战斗系统来决定（根据能量情况）
 * 2、技能项目是一个有一定概率、在某些时刻、对某些对象，释放某些效果(effect)的集合
 *
 *
 *  PS:
 *  1、技能的触发时机，是通过监听"世界上下文"事件来决定的
 */




const oop = require("local-libs").oop;
const event = require("local-libs").event;
const IntegerValue = require("../value/integer");
const Levelable = require("../level/levelable");
const {getChooser} = require("../mechanism/chooseTarget/targetChooser");
const {Effect,EffectEvents,getEffect} = require("../effect/effect");


const SkillType={
    ACTIVE:1,//主动 对于主动技能，release 的时机是有Holder自己决定的（比如能量满）
    PASSIVE:2,//被动 对于被动技能，在人物创建的时候，就会自动release
};



var SkillItem = oop.defineClass({
    
    constructor:function({
        levelCur, //Integer 对象，表示当前等级
        probability,//Integer 对象，表示成功释放概率
        installCycle, //(可空)在什么生命周期去触发里面的effect的install
        targetChooserName, //一个实现了targetChooser基类的对象的名字
        targetChooserParams,//chooser需要的参数
        
        id, //技能项id
        name, //技能项名称
        desc, //技能项描述
        parent, //技能项持有者对象 (技能对象)
    }){
        var self = this;
        event.mixin(self);
        
        self.id = id;
        self.name = name;
        self.desc = desc;
        self.parent=  parent;
        
        self.levelCur = levelCur;
        self.probability = probability;
        self.installCycle = installCycle;
        self.targetChooser = getChooser(targetChooserName);
        self.targetChooserParams = targetChooserParams;
        
        self.effects =[]; //效果项目列表。注意这里的效果，并不是效果实例，而是描述效果的类型和强度参数等 {effectName, effectDesc,effectParams}
    },
    prototype:{
    
        /**
         * 添加一个效果项
         * @param effectName
         * @param effectDesc
         * @param effectParams
         */
        addEffectItem:function (effectName, effectDesc,effectParams) {
          var self = this;
          // let ef = getEffect(effectName,effectDesc,self.levelCur,effectParams);
          // self.effects.push(ef);
          self.effects.push({effectName, effectDesc,effectParams});
        },
        /**
         * 安装技能项
         * @param context：世界上下文
         */
        install:function (context) {
            var self = this;
            
            let _install = function (lifeCycleParams) {
                //todo:先看概率
                //寻找对象
                let targetChooser = self.targetChooser;
                let targets = targetChooser.chooseTarget(self.parent.holder,context,lifeCycleParams,self.targetChooserParams);
                if(targets && targets.length >0){
                    //然后进行效果安装
                    //首先获取技能项里都有哪些效果元数据
                    self.effects.forEach(({effectName, effectDesc,effectParams})=>{
                        
                        //创建一个效果实例
                        let ef = getEffect(effectName,effectDesc,self.levelCur,effectParams);
                        
                        //对每一个对象，进行效果安装
                        targets.forEach((target)=>{
                            target.installEffect(self.parent.holder,ef);
                        })
                    });
                }
            }
            //根据自身的生效周期（如果为空，则立刻生效),来进行处理
            if(self.installCycle){
                let source = self.parent.holder;
                context.on(self.installCycle,(lifeCycleParams)=>{
                    _install(lifeCycleParams);
                });
            }else{
                //如果不需在特定周期触发，那直接触发
                _install({});
            }
            
        }
    }
});

var Skill = oop.defineClass({
    super:Levelable,
    constructor:function({
        type,// SkillType 枚举，表示主动/被动
        levelCur, //number，表示当前等级
        levelMax, //number，表示最高等级
        exp, // number,表示当前获得的经验值
        expTableName, // String，表示经验值增长曲线名称
    },{
        id, //技能id
        name, //技能名称
        desc, //技能描述
        holder, //技能持有者对象 (可以是人，也可以是物品)
    }){
        var self = this;
        event.mixin(self);
        
        self.id = id;
        self.type = type;
        self.name = name;
        self.desc = desc;
        self.holder=  holder;
        self.items =[]; //技能项目初始化
    },
    prototype:{
    
        /**
         * 释放技能
         * @param context：世界上下文
         */
        release:function (context) {
            this.items.forEach((skillItem)=>{
                skillItem.install(context);
            })
        },
    
        /**
         * 添加一个技能项
         * @param id：技能项id
         * @param name:名称
         * @param desc:描述
         */
        addSkillItem:function ({
            id, //技能项id
            name, //技能项名称
            desc, //技能项描述
            probability,//Integer 对象，表示成功释放概率
            installCycle, //(可空)在什么生命周期去触发里面的effect的install
            targetChooserName, //一个实现了targetChooser基类的对象的名字
            targetChooserParams,//chooser需要的参数
        }) {
            
            let item = new SkillItem({
                levelCur:this.levelCur, //Integer 对象，表示当前等级
                probability,//Integer 对象，表示成功释放概率
                installCycle, //(可空)在什么生命周期去触发里面的effect的install
                targetChooserName, //一个实现了targetChooser基类的对象的名字
                targetChooserParams,//chooser需要的参数
                id:id, //技能项id
                name:name, //技能项名称
                desc:desc, //技能项描述
                parent:this, //技能项持有者对象 (技能对象)
            });
            this.items.add(item);
        }
    }
});


module.exports = {SkillItem,Skill};
