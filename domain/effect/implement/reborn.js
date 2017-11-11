/**
 * Created by kaicui on 17/8/6.
 * effect的实现之一:
 * 名称：reborn:重生
 * 作用：当所附着的宿主hp<=0的时候，触发自身效果，在某个时机内，为英雄恢复hp.
 *使用场景：
 *  1、被动技能：死亡之后，在下回合复开始之前活自身，并恢复80%的Hp
 *
 *  注意：
 *  1、英雄hp掉到0之后，会触发"dead"事件，但是只要hero身上有reborn效果，team就不会被判定为团灭，battle就不会结束
 *  2、effect本身如果有continueTurn,然后又使用了延迟复活参数(delayTurn),则有可能导致reborn效果提前被移除，但是复活还没有触发的情况。
 *      所以：配置技能的时候要注意这两个参数，最好是配置成被动技能（continueTurn='ever')
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const increaseMath = require("../../math/increase");
const {Effect,EffectEvents} = require("../effect");
const Integer = require("../../value/integer");
const logger = require('../../../log/logger');
const Status = require('./status');
const {HeroBaseAttributes, HeroDeriveAttributes, HeroOtherAttributes} = require('../../mechanism/role/attributeRule');
const {WordLifeCycle,BattleEvents,HeroEvents} = require("../../mechanism/lifeCycle");


var Reborn = oop.defineClass({
    super:Effect,
    /**
     *
     * @param level
     * @param params:{
     *
            delayTurn:Number  延迟复活回合数（0：表示死亡之后立刻复活。1，则表示死亡之后，在下1个"回合开始"阶段复活)
            
            recoverHpRate: Number (n/1000),  复活之后hp恢复比例（千分比)
            recoverHpRatePerLevel: Number(n/1000) 随着等级 hp恢复比例（千分比)
            recoverHpRateIncrease: string  随着等级，增长函数名
            
            recoverSpRate: Number (n/1000),  复活之后sp恢复比例（千分比)
            recoverSpRatePerLevel: Number(n/1000) 随着等级 sp恢复比例（千分比)
            recoverSpRateIncrease: string  随着等级，增长函数名
     * }
     */
    constructor:function({level,params}){
        var self = this;
        self.name = 'Reborn';
        self.recoverHpRate = self.calculateHPLevelRate();
        self.recoverSpRate = self.calculateSPLevelRate();
        
        self.waitTurnLeft=params.delayTurn; //距离真正复活，剩余需要等待的回合数
    },
    prototype:{
        
        toString:function () {
            var self = this;
            let {continueTurn,delayTurn,recoverHpRate,recoverSpRate} = self.params;
            
            return `英雄若死亡,[${delayTurn>0? (delayTurn==1?"下回合开始时复活":delayTurn+"回合后回合开始前复活")  :"立刻复活"}]${self.recoverHpRate>0?",恢复"+self.recoverHpRate/10+'%HP':''}${self.recoverSpRate>0?",恢复"+self.recoverSpRate/10+'%SP':''}${self.turnInfo()}`;
        },
        
        /**
         * 实现基类方法
         * @param nowLevel
         */
        onLevelChange:function (nowLevel) {
            var self = this;
            self.recoverHpRate = self.calculateHPLevelRate();
            self.recoverSpRate = self.calculateSPLevelRate();
        },
        /**
         * 根据等级计算恢复的hp比例
         * @returns {*}
         */
        calculateHPLevelRate:function () {
            var self = this;
            if(self.params.recoverHpRate!==undefined){
                let {recoverHpRate,recoverHpRatePerLevel,recoverHpRateIncrease,recoverSpRate,recoverSpRatePerLevel,recoverSpRateIncrease} = self.params;
                
                let fn = increaseMath[recoverHpRateIncrease];
                if(fn){
                    // let addVal = basePoint+fn(self.level.total(),levelFactor);
                    let addVal = recoverHpRate+fn(self.level.total(),recoverHpRatePerLevel);
                    return addVal;
                }
            }
            return 0;
        },
        /**
         * 根据等级计算恢复的sp比例
         * @returns {*}
         */
        calculateSPLevelRate:function () {
            var self = this;
            if(self.params.recoverSpRate!==undefined){
                let {recoverHpRate,recoverHpRatePerLevel,recoverHpRateIncrease,recoverSpRate,recoverSpRatePerLevel,recoverSpRateIncrease} = self.params;
                
                let fn = increaseMath[recoverSpRateIncrease];
                if(fn){
                    // let addVal = basePoint+fn(self.level.total(),levelFactor);
                    let addVal = recoverSpRate+fn(self.level.total(),recoverSpRatePerLevel);
                    return addVal;
                }
            }
            return 0;
        },
        /**
         * 进行重生处理，返回是否重生成功
         * @param source
         * @param target
         */
        doReborn:function (source,target) {
            var self = this;
            
            
            logger.debug(`\r\n ${source.toString(true)} 准备复活！`);
            
            //当英雄有多个重生效果叠加的时候，防止效果反复使用
            if(target && target.getAttr(HeroOtherAttributes.HP).getVal()<=0){
                let {recoverHpRate,recoverHpRatePerLevel,recoverHpRateIncrease,recoverSpRate,recoverSpRatePerLevel,recoverSpRateIncrease} = self.params;
                
                //如果需要恢复Hp
                if(self.recoverHpRate){
                    //计算要恢复的量
                    let hp_recover =parseInt(target.getAttr(HeroDeriveAttributes.HP_MAX).getVal() * (self.recoverHpRate/1000));
                    
                    //最少恢复1点HP
                    hp_recover = hp_recover<1?1:hp_recover;
                    logger.debug(`\r\n ${source.toString(true)} 准备恢复${hp_recover}点HP`);
                    //派发mutation给target
                    target.takeMutation({
                        from:source,
                        mutation:{
                            [HeroOtherAttributes.HP]:hp_recover
                        },
                    });
                }
                 //如果需要恢复Sp
                if(self.recoverSpRate){
                    //计算要恢复的量
                    let sp_recover =parseInt(target.getAttr(HeroOtherAttributes.SP_MAX).getVal() * (self.recoverSpRate/1000));
                    
                    //最少恢复1点SP
                    sp_recover = sp_recover<1?1:sp_recover;
                    logger.debug(`\r\n ${source.toString(true)} 准备恢复${sp_recover}点SP`);
                    //派发mutation给target
                    target.takeMutation({
                        from:source,
                        mutation:{
                            [HeroOtherAttributes.SP]:sp_recover
                        },
                    });
                }
                //一旦重生过后，重生效果应该被移除
                logger.debug(`\r\n ${source.toString(true)} 准备移除重生效果${self.toString()}`);
                target.uninstallEffect && target.uninstallEffect(self);
                
            }
            
            return this;
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
            
            //订阅 英雄死亡 事件(只订阅1次)
            self.listenerForHeroDie = target.on(WordLifeCycle.AFTER_HERO_DIE,(lifeCycleParam)=>{
                //宿主对象死亡,则触发复活逻辑
                
                //如果是延迟复活，则需要订阅回合开始事件
                if(self.waitTurnLeft){
                    self.listenerForDoReborn = self.worldContext.on(WordLifeCycle.TURN_BEGIN,(lifeCycleParam)=>{
                        self.waitTurnLeft--;
                        if(self.waitTurnLeft==0){
                            self.doReborn(source,target);//进行复活
                        }
                    });
                }else{
                    //否则立刻复活
                    self.doReborn(source,target);//进行复活
                }
                
            });
            
            
            //调用基类方法
            oop.getSupper(self).onAfterInstall.call(self,source,target);
            
            return this;
        },
        onUninstall:function () {
            var self = this;
            
            
            //取消对宿主的死亡事件订阅
            if(self.listenerForHeroDie){
                self.target && self.target.off(WordLifeCycle.AFTER_HERO_DIE,self.listenerForHeroDie);
                self.listenerForHeroDie=undefined; //清空订阅token
            }
            //取消对上下文的回合开始订阅
            if(self.listenerForDoReborn){
                self.worldContext && self.worldContext.off(WordLifeCycle.TURN_BEGIN,self.listenerForDoReborn);
                self.listenerForDoReborn=undefined; //清空订阅token
            }
            
            //调用基类方法
            oop.getSupper(self).onAfterUnInstall.call(self);
            return this;
        }
    }
});

module.exports = Reborn;
