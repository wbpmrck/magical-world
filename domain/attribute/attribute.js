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
        
        //订阅val的变化
        self.val.on("change",(raw,modify,total,val)=>{
           self.emit("valueChange",total,raw,modify,val);
        });
    },
    prototype:{
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
