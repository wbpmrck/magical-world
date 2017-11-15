/**
 * Created by kaicui on 17/8/6.
 * effect的实现之一:
 * 名称：Status:特殊效果
 * 作用：可持续若干回合，给对象附加特殊状态标记。
 * 约束：来自同一个释放者的，同名状态无法叠加，多次附加只会更新持续回合数（此逻辑等以后做数值平衡的时候再决定是否增加。非必须）
 *使用场景：
 *  1、主动技能：(有30的几率)对目标造成2回合眩晕（注意，概率控制，由skillItem确定。effect主要处理生效之后的情况）
 *
 *  注意：
 *  1、应该只把"影响hero行动方式"的状态放入status管理，目前包括（行动、大招）的控制
 *  2、其他的"状态"，比如燃烧、毒素，这种有"外部物质"附加的状态，应该用单独的effect类来控制，可以继承自status类
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const increaseMath = require("../../math/increase");
const {Effect,EffectEvents} = require("../effect");
const Integer = require("../../value/integer");
const logger = require('../../../log/logger');
var Status = oop.defineClass({
    super:Effect,
    /**
     *
     * @param level
     * @param params:{status:状态名,stopAction:bool 是否阻止行动,stopSkill:bool 是否阻止放技能}
     */
    constructor:function({level,params}){
        var self = this;
        self.name = 'Status';
        
        // self.maxTurn =params.continueTurn; //缓存最大持续回合
    },
    prototype:{
    
        // //将对象内容完全转化为不附带循环引用的纯对象
        // toJSONObject:function ({serializeLevel}) {
        //     var self = this;
        //
        //     let {continueTurn,status,stopAction,stopSkill} = self.params;
        //     if(serializeLevel === 1){
        //         //只需要展示相关的信息
        //         return {
        //             id:self.id,
        //             name:`${status}`,
        //         }
        //     }
        // },
        toString:function () {
            var self = this;
            let {continueTurn,status,stopAction,stopSkill} = self.params;
            
            // return `效果:[${status}${stopAction?",stopAction":""}${stopSkill?",stopSkill":""}]持续[${self.continueTurnLeft}/${continueTurn}]回合`;
            return `效果:[${status}${stopAction?",stopAction":""}${stopSkill?",stopSkill":""}]${self.turnInfo()}`+self.clearableInfo();
        },
       
        /**
         * 实现基类方法
         * @param nowLevel
         */
        onLevelChange:function (nowLevel) {
            var self = this;
        },
        /**
         * 覆盖基类实现
         * @param source
         * @param target
         * @returns {AttributeModify}
         */
        onInstall:function (source,target) {
            var self = this;
            //todo:判断是否已经有同样来源的同样的status,有的话，移除旧的，替换新的（此逻辑等以后做数值平衡的时候再决定是否增加。非必须）
    
            logger.debug(`给 target:${target.toString(true)} 添加状态:[${self.toString()}] \r\n`);
            //调用基类方法
            oop.getSupper(self).onAfterInstall.call(self,source,target);
            // oop.getSupper(self).onInstall.call(self,source,target);
            

    
            // self.emit(EffectEvents.INSTALLED,self); //发射事件，通知外部
          
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

module.exports = Status;
