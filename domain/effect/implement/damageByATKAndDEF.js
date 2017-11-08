/**
 * Created by kaicui on 17/8/6.
 * effect的实现之一:
 * 名称：按照Atk和def进行伤害
 * 作用：计算完伤害之后，应用到target
 * 约束：target必须具有:getAttr(String attrName)方法，返回一个Attribute对象
 *使用场景：
 *  1、主动技能：对目标造成30点神圣伤害
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const increaseMath = require("../../math/increase");
const {Effect,EffectEvents} = require("../effect");
const Integer = require("../../value/integer");
const {HeroBaseAttributes, HeroDeriveAttributes, HeroOtherAttributes} = require('../../mechanism/role/attributeRule');
const {isSingleHappen,multyChoose} = require("../../math/random");
const {WordLifeCycle,BattleEvents,HeroEvents} = require("../../mechanism/lifeCycle");
const logger = require('../../../log/logger');

var DamageByATKAndDEF = oop.defineClass({
    super:Effect,
    /**
     * 直接伤害
     * @param name
     * @param desc
     * @param level
     * @param params：{
        isMagic:false, //是否魔法攻击（决定计算参数是ATK还是MATK)
        atkRate:1000,// ATK按照1000/1000倍率 计算（1倍）
        atkRatePerLevel:200,//每提升1级，参与计算的atk多增加的百分比
        increase:'linear',//等级提升，atk增长函数
        ignoreDEF:0, //无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）数字，则表示无视多少比率的防御(千分比）
        canFlee:false ,//是否可以躲避 。 false意味着必中
        
     * }
     */
    constructor:function({level,params}){
        var self = this;
        self.name = 'damageByATKAndDEF';
        self.atkRate = self.calculateLevelRate();
    },
    prototype:{
    
        //将对象内容完全转化为不附带循环引用的纯对象
        toJSONObject:function ({serializeLevel}) {
            var self = this;
        
            if(serializeLevel === 1){
                //只需要展示相关的信息
                return {
                    id:self.id,
                    name:self.name,
                }
            }
        },
        toString:function () {
            var self = this;
            let {isMagic,atkRate,atkRatePerLevel,ignoreDEF} = self.params;
            return `造成基于${atkRate/10}%${isMagic?'M_ATK':'ATK'}的伤害${ignoreDEF?",无视%"+ignoreDEF/10+"防御":""}]`;
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
        /**
         * 实现基类方法
         * @param nowLevel
         */
        onLevelChange:function (nowLevel) {
            var self = this;
            self.atkRate = self.calculateLevelRate();
        },
        /**
         * 覆盖基类实现
         * @param source
         * @param target
         * @returns {DamageByATKAndDEF}
         */
        onInstall:function (source,target) {
            var self = this;
            
            
            logger.debug(`\r\n source:${source.toString(true)} \r\n --> \r\n target:${target.toString(true)}  \r\n`);
            //实现自己的逻辑：计算"应得伤害"和"实际伤害"
            
            if(source && target){
                let {isMagic,ignoreDEF,canFlee} = self.params;
                let atk = isMagic?source.getAttr(HeroDeriveAttributes.M_ATK).getVal():source.getAttr(HeroDeriveAttributes.ATK).getVal();
                let def = isMagic?target.getAttr(HeroDeriveAttributes.M_DEF).getVal():target.getAttr(HeroDeriveAttributes.DEF).getVal();
    
                let cri = source.getAttr(HeroDeriveAttributes.CRI).getVal();
                let cri_atk = source.getAttr(HeroOtherAttributes.CRI_ATK).getVal();
                let reduce_atk = isMagic?target.getAttr(HeroOtherAttributes.REDUCE_M_ATK).getVal():target.getAttr(HeroOtherAttributes.REDUCE_M_ATK).getVal();
    
                /**
                 * 计算"应得伤害"
                 * @returns {number}
                 */
                function doDamage() {
                    let d = 0;
                    
                    let remark={
                    };//额外的备注信息
    
                    logger.debug(`准备计算伤害`);
                    
                    //如果是神圣攻击，则计算防御无视百分比
                    if(ignoreDEF){
                        let rawDef = isMagic?target.getAttr(HeroDeriveAttributes.M_DEF).val.raw:target.getAttr(HeroDeriveAttributes.DEF).val.raw;
                        def = parseInt(rawDef * ( (1000-ignoreDEF) /1000));
                    }
                    
                    //应得伤害 = 攻击 - 防御
                    d = atk -def;
                    
                    if(d<0){
                        d =1; //最少造成1点伤害
                    }
                    //加成计算
                    
                    //如果是暴击
                    logger.debug(`判断是否暴击，暴击率[${cri/10}%]`);
                    if(isSingleHappen(cri)){
                        
                        //暴击伤害=  应得伤害 X (2倍 + 暴击伤害加成%)
                        d = parseInt(d*(2+ (cri_atk/1000)));
                        remark.cri = true;
                        logger.debug(`触发暴击，暴击后伤害[${d}]`);
                    }
                    
                    //减伤处理
                    d = parseInt( d * (1-reduce_atk/1000));
                    logger.debug(`减伤[${reduce_atk/10}%]后伤害[${d}]`);
    
                    //派发mutation给target
                    target.takeMutation({
                        from:source,
                        mutation:{
                            [HeroOtherAttributes.HP]:0-d
                        },
                        remark:remark
                    });
    
                }
    
                
                //判断对方是否可以闪避
                if(canFlee){
                    //闪避率 = 对象的flee - 发起者的hit
                    let flee = target.getAttr(HeroDeriveAttributes.FLEE).getVal() - source.getAttr(HeroDeriveAttributes.HIT).getVal();
    
                    logger.debug(`判断对方[${target.toString()}]是否可以闪避,最终flee=[${flee/10}%]`);
                    
                    if(isSingleHappen(flee)){
                        //成功躲避
                        logger.debug(`对方[${target.toString()}]成功躲避`);
                        
                        //触发对应生命周期事件
                        target.emit(HeroEvents.AFTER_HERO_FLEE,source,self);
                        source.emit(HeroEvents.AFTER_HERO_MISS,target,self);
                    }else{
                        logger.debug(`对方[${target.toString()}]躲避失败`);
                        //没有躲避，继续计算伤害
                        doDamage();
                    }
                }else{
                    logger.debug(`必中效果，不接受对方[${target.toString()}]躲避`);
                    //这是一个必中效果，直接计算伤害
                    doDamage();
                }
                
                
                // self.emit(EffectEvents.INSTALLED,self); //发射事件，通知外部
                //调用基类方法
                oop.getSupper(self).onAfterInstall.call(self,source,target);
            }
            
            return this;
        },
        onUninstall:function () {
            var self = this;
            
            //调用基类方法
            oop.getSupper(self).onAfterUnInstall.call(self);
            // self.emit(EffectEvents.UNINSTALLED,self); //发射事件，通知外部
            return this;
        }
    }
});

module.exports = DamageByATKAndDEF;
