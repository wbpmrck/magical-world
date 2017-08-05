/**
 * Created by kaicui on 17/8/5.
 * 表示最基础的数值类型(整数）
 *
 * value的修改操作一般分2种：
 *
 * update:[修改]-直接修改raw值,一般使用与hp,mp等这些状态变化的地方
 * modify:[修正]-通过附加modifier,改变外部读取value的时候拿到的数据，raw并没改变。一般使用于：attack,defense等这种属性类场景
 */

const oop = require("local-libs").oop;
const event = require("local-libs").event;

var IntegerValue = oop.defineClass({
    constructor:function(rawValue){
        
        
        var self = this;
        event.mixin(self);
        
        self.raw = parseInt(rawValue);
        self.modify = 0;
    
        //多个对该值的修正项。每一项都一定含一个ref字段，addVal和addPercent一般来说只存在一个
        self.modifier =[/*{ref:<object>,addVal:-20},{ref:<object>,addPercent:0.05}*/];
        
        
    },
    prototype:{
        /**
         * 计算value的本身值+修正值的和
         * @returns {Number}
         */
        total:function () {
          return parseInt(this.raw+this.modify);
        },
        /**
         * 触发change事件到外部，参数:raw,modify,this
         */
        notifyChage:function () {
            this.emit("change",this.raw,this.modify,this.total(),this);
        },
        /**
         * 重设raw值
         * @param raw
         */
        setRaw:function (raw) {
            raw = parseInt(raw);
            let old = this.raw;
            if(old != raw){
                this.raw = raw;
                this.refreshModify(); //raw 改变了，也需要重新计算modify
            }
        },
    
        /**
         * value 根据自己被修正的情况，重新更新modify的值
         */
        refreshModify:function () {
            var self = this;
            self.modify=0; //init
            
            self.modifier.forEach((modifyObject)=>{
                // console.log("modifyObject="+JSON.stringify(modifyObject));
               if(modifyObject.addVal!==undefined){
                   self.modify += parseInt(modifyObject.addVal);
               }
                if(modifyObject.addPercent!==undefined){
                    self.modify += parseInt(self.raw * modifyObject.addPercent);
                }
            });
            
            this.notifyChage();//通知外部change
        },
    
        /**
         * 添加一个修正对象
         * @param ref:触发该值修正的对象引用
         * @param addVal:修正的值
         * @param addPercent:修正的百分比（基于raw)
         */
        addModifier : function(ref,{addVal,addPercent}){
            //必须传入ref,addVal和addPercent至少传入1个
            if(ref!==undefined && (addVal!==undefined || addPercent!==undefined)){
                this.modifier.push({ref,addVal,addPercent});
                this.refreshModify();
            }
        },
        /**
         * 移除修正对象对该value的影响
         * @param ref
         */
        removeModifier : function(ref){
            if(this.modifier && this.modifier.length){
                for(var i=0,j=this.modifier.length;i<j;i++){
                    var item = this.modifier[i];
                    if(item.ref === ref){
                        this.modifier.splice(i,1);
                        this.refreshModify();
                        break;
                    }
                }
            }
        }
        
        
    }
});

module.exports = IntegerValue;
