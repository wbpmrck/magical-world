/**
 * Created by kaicui on 17/8/7.
 *
 * params:{
 * continueTurn:持续的回合数
 *  如果是number，代表生效回合数，到达0就结束（需要订阅target的lifeCycle事件,在回合数小于1的时候uninstall）
 *  如果是'ever',代表永久生效，则不需要订阅回合事件
 *  如果是'continueTurn':如果是undefined则立刻Uninstall
 *
 */




const oop = require("local-libs").oop;
const event = require("local-libs").event;
const IntegerValue = require("../value/integer");
const EffectEvents =  {
    INSTALLED:1,
    UNINSTALLED:2,
};
const {WordLifeCycle,CharLifeCycle} = require("../mechanism/lifeCycle");

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
        
        // self.name = name;
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
        self.listenerOnTurnEnd = undefined;//保留监听target的回合结束事件handlerId,用于取消监听
        
    },
    prototype:{
    
        /**
         * 当等级变化的时候会触发，子类应该重写这个方法
         * @param nowLevel
         */
        onLevelChange:function (nowLevel) {
            
        },
        /**
         * 效果被放到目标对象
         * @param source：效果来源
         * @param target：放置对象
         * @returns {Effect}
         */
        onInstall:function (source,target) {
            var self = this;
            self.source = source;
            self.target = target;
            
            //如果自己有持续回合数定义，则需要自行关注世界的回合事件，决定何时uninstall,离开target
            if(self.params.continueTurn!==undefined && self.params.continueTurn!='ever'){
                self.listenerOnTurnEnd = self.worldContext.on(WordLifeCycle.TURN_END,(lifeCycleParam)=>{
                    self.params.continueTurn--;
                    if(self.params.continueTurn<1){
                        self.target.uninstallEffect(self); //持续回合数到了，移除自身
                        self.listenerOnTurnEnd=undefined; //event那边会自动根据TTL删除本回调函数。这里只需要清空订阅token即可
                    }
                },self.params.continueTurn); //通过TTL控制自动取消订阅
            }
            
            // self.emit(EffectEvents.INSTALLED,self); //发射事件，通知外部
            return self;
        },
        /**
         * 效果从对象上移除了
         * @returns {Effect}
         */
        onUninstall:function () {
            var self = this;
            // //取消在世界上下文中的监听
            // if(self.listenerOnTurnEnd!==undefined){
            //     self.worldContext.off(WordLifeCycle.TURN_END,self.listenerOnTurnEnd);
            //     self.listenerOnTurnEnd=undefined;
            // }
            this.source = this.target = undefined;
            
            // this.emit(EffectEvents.UNINSTALLED,this); //发射事件，通知外部
            return this;
        },
        toString:function(){
            // return `level[${this.level.total()}][${this.name}][${this.desc}]`;
            return "unknown effect"
        }
    }
});

let getEffect=function (effectName,level,worldContext, params) {
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
module.exports = {Effect,EffectEvents,getEffect};
