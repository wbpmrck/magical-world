/**
 * Created by kaicui on 17/8/7.
 *
 *
 * 所有效果通用的参数
 * params:{
 *
 * continueTurn:持续的回合数
 *  如果是number，代表生效回合数，到达0就结束（需要订阅target的lifeCycle事件,在回合数小于1的时候uninstall）
 *  如果是'ever',代表永久生效，则不需要订阅回合事件
 *  如果是undefined，则立刻Uninstall
 *
 *
 * category:仅仅用于给效果进行分类（方便一些清楚类技能的运作）枚举参考：effectCategoryEnum
 *
 *
 * removeAfterBattle
 *  true:战斗结束时，会自动清除此类效果
 *  false:战斗结束时，效果可以不清（一些永久被动类技能可以使用）
 *
 * clearable
 *  true:能够被 "clearOtherEffect" 效果来清除
 *  false/undefined: 不能够被 "clearOtherEffect" 效果来清除
 *
 * icon:String
 * 用于表示在UI展示中，效果的展示图标。最好是64X64 或者128X128 png
 */




const oop = require("local-libs").oop;
const event = require("local-libs").event;
const IntegerValue = require("../value/integer");
const logger = require('../../log/logger');
const EffectEvents =  {
    INSTALLED:1,
    UNINSTALLED:2,
};
const {WordLifeCycle} = require("../mechanism/lifeCycle");

const {EffectAndAttrCarrierLifeEvent} = require("../effect/effectAndAttrCarrier");
var seed=1000;

var Effect = oop.defineClass({
    
    /**
     *
     * @param level
     * @param params
     * @param worldContext
     */
    constructor:function({level,params,worldContext}){
        var self = this;
        event.mixin(self);
        
        self.id = seed++;
        self.name = 'base';
        // self.desc = desc;
    
        //这里的level应该是一个 integerValue,方便以后对effect等级进行修正.
        if(! (level instanceof IntegerValue) ){
            throw new Error(`param level must be instance of IntegerValue!`)
        }
        
        self.level = level;
        self.level.on("change",function (raw,modify,total,val) {
            self.onLevelChange(total);
        });
        
        self.params = params; //由外部上下文来注入，效果的具体参数。这个参数由具体的效果自己来定义
        self.worldContext = worldContext; //世界上下文。主要用于了解世界发生的lifeCycle
        self.source = self.target = undefined; //效果的作用源、作用对象
        self.__listenerOnTurnEnd = undefined;//保留监听target的回合结束事件handlerId,用于取消监听
        self.continueTurnLeft = self.params.continueTurn;//保存效果剩余持续回合数
    },
    prototype:{
    
        /**
         * 子类通用方法，返回当前效果的持续状态信息
         */
        turnInfo:function () {
            var self = this;
            let {continueTurn} = self.params;
            if(continueTurn!==undefined &&continueTurn!=='ever'){
                return `[持续${self.continueTurnLeft}/${continueTurn}回合]`
            }
            return "";
        },
        /**
         * 子类通用方法，返回当前效果是否可清除信息
         */
        clearableInfo:function () {
            var self = this;
            let {clearable,continueTurn} = self.params;
            
            //只有持续性的效果，才存在需要被清除的需要（其他效果自从安装之后就自动清除了）
            if(continueTurn!==undefined){
                if(clearable){
                    return `[可被清除]`
                }
                return "[不可被清除]";
            }else{
                return ""
            }
        },
        //将对象内容完全转化为不附带循环引用的纯对象
        toJSONObject:function ({serializeLevel}) {
            var self = this;
        
            let {continueTurn,status,stopAction,stopSkill} = self.params;
            if(serializeLevel === 1){
                //只需要展示相关的信息
                return {
                    id:self.id,
                    name:self.name,
                    level:self.level.total(),
                    params:JSON.parse(JSON.stringify(self.params))
                }
            }
        },
        /**
         * 当等级变化的时候会触发，子类应该重写这个方法
         * @param nowLevel
         */
        onLevelChange:function (nowLevel) {
            
        },
       
        onAfterInstall:function (source,target) {
            var self = this;
    
            self.source = source;
            self.target = target;
            self.emit(EffectEvents.INSTALLED,self); //发射事件，通知外部
            //在target上面触发对应的事件
            self.target.emit(EffectAndAttrCarrierLifeEvent.AFTER_INSTALL_EFFECT,source,self);
            
            
            //如果自己有持续回合数定义，则需要自行关注世界的回合事件，决定何时uninstall,离开target
            if(self.params.continueTurn!==undefined && self.params.continueTurn!='ever'){
                self.__listenerOnTurnEnd = self.worldContext.on(WordLifeCycle.TURN_END,(lifeCycleParam)=>{
    
                    
                    // self.params.continueTurn--;
                    // if(self.params.continueTurn<1){
                    self.continueTurnLeft--;
                    logger.debug(`effect:[${self.id}]监听到回合结束!self.continueTurnLeft=[${self.continueTurnLeft}]`);
                    if(self.continueTurnLeft<1){
                        self.target.uninstallEffect && self.target.uninstallEffect(self); //持续回合数到了，移除自身
                    }
                // },self.params.continueTurn); //通过TTL控制自动取消订阅
                }); //通过TTL控制自动取消订阅
            }
            //如果该效果没有持续回合数字段，则直接调用uninstall立刻移除
            if(self.params.continueTurn===undefined){
                self.target.uninstallEffect && self.target.uninstallEffect(self);
            }
    
        },
       
        onAfterUnInstall:function () {
            var self = this;
            
            logger.debug(`effect:[${self.id}][${self.toString()}]准备uninstall!`);
    
            let _source = self.source;
            let _target = self.target;
            this.source = this.target = undefined;
            //在target上面触发对应的事件
            _target.emit(EffectAndAttrCarrierLifeEvent.AFTER_UNINSTALL_EFFECT,_source,self);
            
            
            if(self.__listenerOnTurnEnd){
    
                logger.debug(`effect:[${self.id}]取消订阅![${self.__listenerOnTurnEnd}]`);
                self.worldContext && self.worldContext.off(WordLifeCycle.TURN_END,self.__listenerOnTurnEnd);
                self.__listenerOnTurnEnd=undefined; //清空订阅token
            }
            this.emit(EffectEvents.UNINSTALLED,this); //发射事件，通知外部
          
        },
        /**
         * 效果被放到目标对象
         * @param source：效果来源
         * @param target：放置对象
         * @returns {Effect}
         */
        onInstall:function (source,target) {
            var self = this;
            
            throw new Error("sub effect must implemnt its own!");
        },
        /**
         * 效果从对象上移除了
         * @returns {Effect}
         */
        onUninstall:function () {
            var self = this;
            throw new Error("sub effect must implemnt its own!");
            // return this;
        },
        toString:function(){
            // return `level[${this.level.total()}][${this.name}][${this.desc}]`;
            return "unknown effect"
        }
    }
});

var getEffect=function (effectName,level,worldContext, params) {
    
    //todo:因为部分效果会利用params来保存自己的一些状态，所以必须保证params参数是一个完全独立的pojo,每个effect独享
    //这里使用序列化来处理
    params = JSON.parse(JSON.stringify(params));
    
    let cons = require(`./implement/${effectName}`);
    let ef = new cons({
        // name:effectName,
        // desc:effectDesc,
        level:level,
        worldContext:worldContext,
        params:params
    });
    return ef;
}
module.exports = {Effect,EffectEvents,getEffect:getEffect};
