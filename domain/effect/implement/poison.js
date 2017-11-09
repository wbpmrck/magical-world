/**
 * Created by kaicui on 17/8/6.
 * effect的实现之一:
 * 名称：poison:中毒
 * 作用：可持续若干回合，"回合结束"的时候，给宿主造成伤害。(不考虑暴击、也不考虑闪避)
 *使用场景：
 *  1、主动技能：(有30的几率)对目标造成2回合眩晕（注意，概率控制，由skillItem确定。effect主要处理生效之后的情况）
 *
 *  注意：
 *  1、应该只把"影响hero行动方式"的状态放入status管理，目前包括（行动、大招）的控制
 *  2、其他的"状态"，比如燃烧、毒素，这种有"外部物质"附加的状态，应该用单独的effect类来控制，可以继承自status类
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const increaseMath = require("../../math/increase");
const {Effect,EffectEvents} = require("../effect");
const Integer = require("../../value/integer");
const logger = require('../../../log/logger');
const Status = require('./status');
const {HeroBaseAttributes, HeroDeriveAttributes, HeroOtherAttributes} = require('../../mechanism/role/attributeRule');
const {WordLifeCycle,BattleEvents,HeroEvents} = require("../../mechanism/lifeCycle");


var Poison = oop.defineClass({
    super:Effect,
    /**
     *
     * @param level
     * @param params:{
     *
         deadly:bool  是否致死（如果是false,敌方的hp不会因为毒素掉到0)
         isMagic:false, //是否魔法攻击（决定计算参数是ATK还是MATK)
        atkRate:1000,// ATK按照1000/1000倍率 计算（1倍）
        atkRatePerLevel:200,//每提升1级，参与计算的atk多增加的百分比
        increase:'linear',//等级提升，atk增长函数
        ignoreDEF:0, //无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）数字，则表示无视多少比率的防御(千分比）
     * }
     */
    constructor:function({level,params}){
        var self = this;
        self.name = 'Poison';
        self.atkRate = self.calculateLevelRate();
        self.maxTurn = params.continueTurn;//缓存最大回合数
    },
    prototype:{
       
        toString:function () {
            var self = this;
            let {continueTurn,deadly,isMagic,atkRate,atkRatePerLevel,ignoreDEF} = self.params;
            
            return `中毒效果(${deadly?"致死":"不致死"}):持续[${continueTurn}/${self.maxTurn}]回合,每回合造成基于${self.atkRate/10}% ${isMagic?'M_ATK':'ATK'}的伤害${ignoreDEF?",无视%"+ignoreDEF/10+"防御":""}]`;
        },
        
        /**
         * 实现基类方法
         * @param nowLevel
         */
        onLevelChange:function (nowLevel) {
            var self = this;
            self.atkRate = self.calculateLevelRate();
        },
        /**
         * 根据等级计算参与计算的atk的比例
         * @returns {*}
         */
        calculateLevelRate:function () {
            var self = this;
            if(self.params.atkRatePerLevel){
                let {atkRate,atkRatePerLevel,increase} = self.params;
            
                let fn = increaseMath[increase];
                if(fn){
                    // let addVal = basePoint+fn(self.level.total(),levelFactor);
                    let addVal = atkRate+fn(self.level.total(),atkRatePerLevel);
                    return addVal;
                }
            }
            return 0;
        },
        doPoisonDamage:function (source,target) {
            var self = this;
        
        
            logger.debug(`\r\n source:${source.toString(true)} \r\n --> \r\n target:${target.toString(true)}  \r\n`);
            //实现自己的逻辑：计算"应得伤害"和"实际伤害"
        
            if(source && target){
                let {isMagic,ignoreDEF,deadly} = self.params;
                let atk = isMagic?source.getAttr(HeroDeriveAttributes.M_ATK).getVal():source.getAttr(HeroDeriveAttributes.ATK).getVal();
                let def = isMagic?target.getAttr(HeroDeriveAttributes.M_DEF).getVal():target.getAttr(HeroDeriveAttributes.DEF).getVal();
            
                let cri = source.getAttr(HeroDeriveAttributes.CRI).getVal();
                let cri_atk = source.getAttr(HeroOtherAttributes.CRI_ATK).getVal();
            
                let reduce_atk = isMagic?target.getAttr(HeroOtherAttributes.REDUCE_M_ATK).getVal():target.getAttr(HeroOtherAttributes.REDUCE_ATK).getVal();
                let ignore_def = isMagic?source.getAttr(HeroOtherAttributes.IGNORE_M_DEF).getVal():target.getAttr(HeroOtherAttributes.IGNORE_DEF).getVal();
    
                let d = 0;
    
                let remark={
                    damageCategory:"poison" //伤害分类
                };//额外的备注信息
    
                logger.debug(`准备计算伤害`);
    
                //计算防御无视百分比
                if(ignoreDEF){
                    ignore_def += ignoreDEF;
                }
    
                //确定：参与计算"应得伤害"的 对方防御力
                def = parseInt(def * ( (1000-ignore_def) /1000));
    
    
                //确定：参与计算"应得伤害"的 攻击方攻击力
                atk = parseInt(atk * (self.atkRate /1000) );
    
    
                //应得伤害 = 攻击 - 防御
                d = atk -def;
    
                if(d<=0){
                    d =1; //最少造成1点伤害
                }
               
                //减伤处理
                d = parseInt( d * (1-reduce_atk/1000));
                logger.debug(`减伤[${reduce_atk/10}%]后伤害[${d}]`);
    
                //检查此伤害是否是"非致死"
                if(!deadly){
                    let target_hp = target.getAttr(HeroOtherAttributes.HP).getVal();
                    logger.debug(`非致死伤害，此时对方剩余HP:[${target_hp}]`);
                    //如果对方剩余生命值<=伤害值。设置伤害值为对方生命值-1
                    if(target_hp<=d){
                        d = target_hp-1;
                        logger.debug(`非致死伤害，修改伤害为:[${d}]`);
                    }
                }
                
                //派发mutation给target
                target.takeMutation({
                    from:source,
                    mutation:{
                        [HeroOtherAttributes.HP]:0-d
                    },
                    remark:remark
                });
                
            
            }
        
            return this;
        },
        /**
         * 覆盖基类实现
         * @param source
         * @param target
         * @returns {AttributeModify}
         */
        onInstall:function (source,target) {
            var self = this;
            logger.debug(`给 target:${target.toString(true)} 添加状态:[${self.toString()}] \r\n`);

            //订阅回合结束事件
            self.listenerForDoPoison = self.worldContext.on(WordLifeCycle.TURN_END,(lifeCycleParam)=>{
                self.doPoisonDamage(source,target);//进行毒素伤害
            },self.params.continueTurn); //通过TTL控制自动取消订阅
    
    
            //调用基类方法
            oop.getSupper(self).onAfterInstall.call(self,source,target);
            
            return this;
        },
        onUninstall:function () {
            var self = this;
    
    
            if(self.listenerForDoPoison){
                self.worldContext && self.worldContext.off(self.listenerForDoPoison);
                self.listenerForDoPoison=undefined; //清空订阅token
            }
    
            //调用基类方法
            oop.getSupper(self).onAfterUnInstall.call(self);
            return this;
        }
    }
});

module.exports = Poison;
