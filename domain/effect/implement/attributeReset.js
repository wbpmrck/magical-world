/**
 * Created by kaicui on 17/8/6.
 * effect的实现之一:
 * 名称：属性值修改效果(按绝对值)
 * 作用：直接修改某属性值（uninstall 的时候不恢复）
 * 约束：target必须具有:getAttr(String attrName)方法，返回一个Attribute对象
 *使用场景：
 *  1、主动技能：对目标造成30点神圣伤害 （相当于 reset 属性值为 当前-30）
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const increaseMath = require("../../math/increase");
const {Effect,EffectEvents} = require("../effect");
const Integer = require("../../value/integer");

var AttributeReset = oop.defineClass({
    super:Effect,
    /**
     * 直接伤害
     * @param name
     * @param desc
     * @param level
     * @param params：{attrName:属性名,mode:"inc"or"dec"表示增加还是减少,basePoint:基础修正点数(整数),levelFactor:用于和等级相乘的因子,increase:增长函数名，参见math/increase.js}
     */
    constructor:function({level,params}){
        var self = this;
        self.name = 'AttributeReset';
        self.addVal=new Integer(0); //暂存当前效果已经产生的属性修正，默认0
    
        let addVal = self.calculateAddVal();
        self.addVal.setRaw(addVal); //修正值，每次通过setRaw更新
    },
    prototype:{
    
        toString:function () {
            var self = this;
            let {attrName,mode,basePoint,levelFactor,increase} = self.params;
            if(self.target){
                let attr = self.target.getAttr(attrName);
                return `${attr.desc}${mode=="inc"?"增加":"减少"}${Math.abs(self.addVal.total())}`;
            }else{
                return `${attrName}${mode=="inc"?"增加":"减少"}${Math.abs(self.addVal.total())}`;
            }
            
        },
        /**
         * 根据当前状态，计算应该修正的属性值
         * @returns {*}
         */
        calculateAddVal:function () {
            var self = this;
            if(self.params.attrName){
                let {mode,basePoint,levelFactor,increase} = self.params;
        
                let fn = increaseMath[increase];
                if(fn){
                    //添加值=基础值+变换函数(当前等级，变换因子)
                    let addVal = basePoint+fn(self.level.total(),levelFactor);
                    if(mode=="dec"){
                        addVal = -addVal;
                    }
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
            let addVal = self.calculateAddVal();
            self.addVal.setRaw(addVal); //修正值，每次通过setRaw更新
        },
        /**
         * 覆盖基类实现
         * @param source
         * @param target
         * @returns {AttributeModify}
         */
        onInstall:function (source,target) {
            var self = this;
    
            //调用基类方法
            // oop.getSupper(self).onInstall.call(self,source,target);
            
            //实现自己的逻辑：给目标角色增加属性
            // self.params={attrName:属性名,mode:"inc"or"dec"表示增加还是减少,basePoint:基础修正点数(整数),levelFactor:用于和等级相乘的因子,increase:增长函数名，参见math/increase.js}
    
            if(self.params.attrName){
                let {attrName,mode,basePoint,levelFactor,increase} = self.params;
                
                if(target.getAttr && typeof target.getAttr ==='function'){
                    
                    //获取到目标需要修正的属性对象
                    let attr = target.getAttr(attrName);
                    let fn = increaseMath[increase];
                    if(fn){
                        attr.updateAdd(self.addVal.total());
    
                        oop.getSupper(self).onAfterInstall.call(self,source,target);
                        // self.emit(EffectEvents.INSTALLED,self); //发射事件，通知外部
                    }
                }
            }
            
            return this;
        },
        onUninstall:function () {
            var self = this;
           
            //调用基类方法
            oop.getSupper(self).onAfterUnInstall.call(self);
            // oop.getSupper(self).onUninstall.call(self);
    
            // self.emit(EffectEvents.UNINSTALLED,self); //发射事件，通知外部
            return this;
        }
    }
});

module.exports = AttributeReset;
