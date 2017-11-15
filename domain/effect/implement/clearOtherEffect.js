/**
 * Created by kaicui on 17/8/6.
 * effect的实现之一:
 * 名称：RemoveOtherEffect:清除其他效果
 * 作用：可清除target上满足条件的Effect
 *使用场景：
 *  1、主动技能：净化：清除目标负面效果
 *
 *  注意：
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const increaseMath = require("../../math/increase");
const {Effect,EffectEvents} = require("../effect");
const Integer = require("../../value/integer");
const logger = require('../../../log/logger');

var ClearOtherEffect = oop.defineClass({
    super:Effect,
    /**
     *
     * @param level
     * @param params:{
        minLevelToClear: number (要清除的效果的最小等）可空
        maxLevelToClear: number (要清除的效果的最大等级）可空
        categoryToClear: string (要清除的效果分类) 可空
        nameToClear: string (要清除的效果名，多个可以|号分割) 可空
     }
     */
    constructor:function({level,params}){
        var self = this;
        self.name = 'ClearOtherEffect';
        
    },
    prototype:{
    
       
        toString:function () {
            var self = this;
            let {minLevelToClear,maxLevelToClear,categoryToClear,nameToClear} = self.params;
            
            let lvlInfo = `${minLevelToClear===undefined?"":"大于"+minLevelToClear+"级,"}${maxLevelToClear===undefined?"":"小于"+maxLevelToClear+"级,"}`;
            let cateInfo = `${categoryToClear===undefined?"":"类别为["+categoryToClear+"]"}`;
            let nameInfo = `${nameToClear===undefined?"":"名称为["+nameToClear+"]"}`;
            
            let info = ( !lvlInfo && !cateInfo && !nameInfo ) ?"所有效果":`${lvlInfo}${cateInfo}${nameInfo}的效果`;
            
            
            return `清除[${info}].${self.turnInfo()}${self.clearableInfo()}`;
        },
       
        /**
         * 实现基类方法
         * @param nowLevel
         */
        onLevelChange:function (nowLevel) {
            var self = this;
        },
    
        /**
         * 检查目标身上的effect,如果有符合清除条件的，则进行清除
         */
        doClear:function (source,target) {
            var self = this;
            let {minLevelToClear,maxLevelToClear,categoryToClear,nameToClear} = self.params;
            
            logger.debug(`[${self.toString()}],清除对象:${target.toString()}`);
            
            let removeCount = 0;
            
            target.removeEffects((ef)=>{
                let { params:{clearable,category},name,level} = ef;
                if(clearable){
                   if(minLevelToClear!==undefined && level.total()<minLevelToClear){
                       return false;
                   } else if(maxLevelToClear !== undefined && level.total() > maxLevelToClear){
                       return false;
                   }else if(categoryToClear !== undefined && category !== categoryToClear){
                       return false;
                   }else if(nameToClear !== undefined ){
                       //展开要清除的名称列表
                       let names = nameToClear.split("|");
                       let found = names.filter((n)=>n.toLowerCase()===name.toLowerCase());
                       if(!found || found.length<1){
                           return false
                       }
                   }
                   removeCount++;
                   return true;
                }else{
                    return false;
                }
            });
            
            logger.debug(`清除了${removeCount}个效果`)
            
        },
        /**
         * 覆盖基类实现
         * @param source
         * @param target
         * @returns {AttributeModify}
         */
        onInstall:function (source,target) {
            var self = this;
            logger.debug(`给 target:${target.toString(true)} 添加状态:[${self.toString()}] \r\n`);
            //开始清除其他效果
            self.doClear(source,target);
            //调用基类方法
            oop.getSupper(self).onAfterInstall.call(self,source,target);
            
          
            return this;
        },
        onUninstall:function () {
            var self = this;
           
            //调用基类方法
            oop.getSupper(self).onAfterUnInstall.call(self);
            return this;
        }
    }
});

module.exports = ClearOtherEffect;
