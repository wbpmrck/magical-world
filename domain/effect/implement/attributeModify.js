/**
 * Created by kaicui on 17/8/6.
 * effect的实现之一:
 * 名称：属性修改效果
 * 作用：修改某些属性，增加modify
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const Effect = require("../effect");

var AttributeModify = oop.defineClass({
    super:Effect,
    /**
     * 属性修正效果
     * @param name
     * @param desc
     * @param level
     * @param params
     */
    constructor:function({name,desc,level,params}){
        var self = this;
        
    },
    prototype:{
        /**
         * 覆盖基类实现
         * @param source
         * @param target
         * @returns {AttributeModify}
         */
        onInstall:function (source,target) {
            var self = this;
    
            //调用基类方法
            oop.getSupper(self).call(self,source,target);
            
            
            return this;
        }
    }
});

module.exports = AttributeModify;
