/**
 * Created by kaicui on 17/8/15.
 * 表示一个可以附着多个effect的、并且可以持有若干属性的对象。
 *
 * 这个类其实和effectCarrier完全一样，唯一不同的是基类是attributeCarrier.
 *
 * todo:因为js里没有多重继承，也没用golang里的embed，所以这个类通过耦合AttributeCarrier,来实现更方便的编程
 *
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const AttributeCarrier = require("../attribute/attrCarrier");

const EffectAndAttrCarrierLifeEvent={
  "BEFORE_INSTALL_EFFECT":1,  //被添加效果之前触发
  "AFTER_INSTALL_EFFECT":2,   //被添加效果之后触发
  "AFTER_CANCEL_EFFECT":3,   //添加效果动作，被取消之后触发
  "BEFORE_UNINSTALL_EFFECT":4,  //被移除效果之前触发
  "AFTER_UNINSTALL_EFFECT":5,   //被移除效果之后触发
};

var EffectAndAttrCarrier = oop.defineClass({
    super:AttributeCarrier,
    constructor:function(){
        var self = this;
        event.mixin(self);
        
        self.effects=[];//附着的效果
    },
    prototype:{
    
        /**
         * 从carrier身上移除指定效果对象
         * @param effect：效果对象引用
         * @returns {boolean}：是否成功移除
         */
        uninstallEffect:function (effect) {
            let found = this.effects.findIndex((it)=>it===effect);
            if(found!==-1){
                //触发生命周期事件
                this.emit(EffectAndAttrCarrierLifeEvent.BEFORE_UNINSTALL_EFFECT,effect);
                
                this.effects.splice(found,1);
    
                
                effect.onUninstall(); //调用effect的uninstall
                //触发生命周期事件
                this.emit(EffectAndAttrCarrierLifeEvent.AFTER_UNINSTALL_EFFECT,effect);
                return true;
            }else{
                return false;
            }
        },
        /**
         *
         * 添加效果的入口，调用这个方法为一个effectCarrier添加一个效果
         * @param source：效果来源
         * @param effect：效果本身 (必须是 Effect 对象)
         * @returns {boolean}:返回是否真正添加了效果
         */
        installEffect:function (source,effect) {
            //检查是否可以添加这个效果
            let context ={cancel:false};//定义上下文参数，在BEFORE_INSTALL_EFFECT事件中功能，外部handler可以在context放入参数，来影响最终的效果添加
            
            //调用事件处理函数（效果添加之前）,并允许外部修改context
            this.emit(EffectAndAttrCarrierLifeEvent.BEFORE_INSTALL_EFFECT,context,source,effect);
            
            //如果被取消
            if(context.cancel){
                //触发事件:效果被取消
                this.emit(EffectAndAttrCarrierLifeEvent.AFTER_CANCEL_EFFECT,context,source,effect);
                return false;
            }
            
            //增加效果
            this.effects.push(effect);
            //触发effect的onInstall
            effect.onInstall(source,this);
             
            //触发事件：效果添加完成
            this.emit(EffectAndAttrCarrierLifeEvent.AFTER_INSTALL_EFFECT,context,source,effect);
            return true;
        }
    }
});

module.exports = {EffectAndAttrCarrier,EffectAndAttrCarrierLifeEvent};
