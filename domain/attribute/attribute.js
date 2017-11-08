/**
 * Created by kaicui on 17/8/6.
 * 表示属性的基类
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const Integer = require("../value/integer");

var Attribute = oop.defineClass({
    constructor:function(name,desc,rawValInt){
        var self = this;
        event.mixin(self);
        
        self.name = name;
        self.desc = desc;
        self.val = new Integer(rawValInt);
        
        self.nowTotal=self.val.total();
        //订阅val的变化
        self.val.on("change",(raw,modify,total,val)=>{
           self.emit("valueChange",total,raw,modify,val,self.nowTotal);
            self.nowTotal = total;
        });
    },
    prototype:{
        toString:function () {
          return `${self.name}:${self.val.total()}`;
        },
        /**
         * 设置表示取值范围的属性attr（或Number)（如果变更，本属性的值会随之调整）
         * @param min
         * @param max
         */
        setValueRange:function ({min,max}) {
            var self = this;
            
            let minVal = min.getVal?min.getVal():min;
            let maxVal = max.getVal?max.getVal():max;
            
            self.val.changeRawRange({min:minVal,max:maxVal});
            
            //订阅变化
            if(min.on){
                min.on("valueChange",function (total,raw,modify,val,oldTotal) {
                    self.val.changeRawRange({min:total,max:maxVal});
                });
            }
            if(max.on){
                max.on("valueChange",function (total,raw,modify,val,oldTotal) {
                    self.val.changeRawRange({min:minVal,max:total});
                });
            }
            
        },
        /**
         * 获取当前值
         * @returns {*|Number}
         */
        getVal:function () {
          return this.val.total();
        },
    
        removeModifier:function (modifierRef) {
            this.val.removeModifier(modifierRef);
            return this;
        },
        /**
         * 修正value
         * @param modifierRef
         * @param addVal
         * @returns {Attribute}
         */
        modifyAdd:function (modifierRef,addVal) {
            this.val.addModifier(modifierRef,{addVal});
            return this;
        },
        
        /**
         * 修正value
         * @param addPercent
         * @returns {Attribute}
         */
        modifyAddPercent:function (modifierRef,addPercent) {
            this.val.addModifier(modifierRef,{addPercent});
            return this;
        },
        /**
         * 修改value的raw
         * @param addVal
         * @returns {Attribute}
         */
        updateAdd:function (addVal) {
            this.val.setRaw(this.val.raw+addVal);
            return this;
        },
        /**
         * 修改value的raw
         * @param addPercent
         * @returns {Attribute}
         */
        updateAddPercent:function (addPercent) {
            this.val.setRaw(this.val.raw*(1+addPercent));
            return this;
        }
    }
});

module.exports = Attribute;
