/**
 * Created by kaicui on 17/8/6.
 * 计算属性
 *
 * 计算属性是一种特殊的属性，他的值会依赖其他的属性来重新计算raw。
 * 计算属性会覆盖自身的raw,根据依赖属性进行计算，并且，不应该手动设置raw（即使手动设置了，当依赖发生变化之后，手动修改的结果还是会被覆盖）
 *
 * 比如A依赖B,C
 *
 * 那么当属性B,C的最终value发生变化（被update/modify),那么A的value的raw也会发生变化
 *
 * 但是要注意，只有A.val.raw是依赖其他属性的，A.val本身收到的modify还是基于A.val.raw计算的
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const Attribute = require("./attribute");

var ComputeAttribute = oop.defineClass({
    super:Attribute,
    /**
     *
     * @param name
     * @param desc
     * @param rawValInt
     * @param depsAttrArray:所依赖的其他属性数组
     * @param depsComputerFn(depsAttrArray,calCallback):计算属性值的函数.这个函数有2个参数,第二个参数是当计算完成之后的回调
     */
    constructor:function(name,desc,rawValInt,depsAttrArray,depsComputerFn){
        var self = this;
        
        self.depsArray = depsAttrArray;
        self.depsComputerFn = depsComputerFn;
        self.dirty = true; //当前计算的值是否过期
    
        self.refreshRaw();//构造函数里，首次计算raw
        
        //订阅每个依赖的attr的变化
        self.depsArray.forEach((depAttr)=>{
            depAttr.on("valueChange",(total,raw,modify,val)=>{
                self.dirty = true; //依赖值发生变化之后，重新计算raw
                self.refreshRaw();
            });
        });
    },
    prototype:{
        /**
         * 根据自身的deps,重新计算raw
         * @returns {ComputeAttribute}
         */
        refreshRaw:function () {
            var self = this;
            if(self.dirty){
                
                self.depsComputerFn(self.depsArray,(newVal)=>{
                    self.val.setRaw(newVal);
                });
                
                self.dirty = false; //计算结束，重置dirty标记
            }
            
            return this;
        }
    }
});

module.exports = ComputeAttribute;
