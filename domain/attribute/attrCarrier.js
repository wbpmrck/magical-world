/**
 * Created by kaicui on 17/8/15.
 * 一个基类，表示持有一堆属性集合的对象。
 * 其他类可以通过继承此类，来变成一个具备若干属性的对象
 *
 * 事件：
 * 1、attrChange：当内部属性变化的时候，就发射该事件。
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const attribute = require("./attribute");
const computeAttr = require("./computeAttr");

var AttributeCarrier =oop.defineClass({
    super:undefined,
    constructor:function(){
        var self = this;
        event.mixin(self);
        
        self.attrMap={};  //{<att.name>:attr}
        self.attrListenerId={} //{<att.name>:int}  用于保存对attr的变化监听的函数下标
        
    },
    prototype:{
    
        /**
         * 导出所有的非 computed 属性的raw值
         * @returns {{}}
         */
        exportAttributesRaw:function () {
          var exported ={}; //key:attrName  value:attrVal
            
            for(var k in this.attrMap){
                if(! (this.attrMap[k] instanceof computeAttr )&& (this.attrMap[k] instanceof attribute) ){
                    exported[k] = this.attrMap[k].val.raw;
                }
            }
            return exported;
        },
    
        /**
         * 判断是否具有某个属性
         * @param attrName
         * @returns {boolean}
         */
        hasAttr:function (attrName) {
            return this.attrMap.hasOwnProperty(attrName);
        },
        /**
         * 根据属性名，获取属性对象
         * @param attrName
         * @returns {*}
         */
        getAttr:function (attrName) {
            return this.attrMap[attrName];
        },
        /**
         * 添加属性
         * @param attr:attribute对象
         */
        addAttr:function (attr) {
            if(attr){
                this.attrMap[attr.name] = attr;
                //添加监听
                this.attrListenerId[attr.name]=attr.on("valueChange",(total,raw,modify,val,oldTotal)=>{
                    this.emit("attrChange",attr,total,raw,modify,val,oldTotal);
                });
            }
            return this;
        },
        /**
         * 移除属性
         * @param attr：属性名称或者属性对象
         */
        removeAttr:function (attr) {
            if(attr){
                if(typeof attr=='string'){
                    this.attrMap[attr].off("valueChange",this.attrListenerId[attr]);
                    this.attrMap[attr] = undefined;
                    delete this.attrMap[attr];
                }else {
                    attr.off("valueChange",this.attrListenerId[attr.name]);
                    this.attrMap[attr.name] = undefined;
                    delete this.attrMap[attr.name];
                }
            }
        }
    }
});

module.exports =AttributeCarrier;