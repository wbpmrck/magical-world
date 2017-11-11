/** 定义战斗相关的流程和规则
 * Created by kaicui on 17/10/8.
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const {HeroBaseAttributes,HeroOtherAttributes,HeroDeriveAttributes} = require("../role/attributeRule");
const {TeamEvents} = require("./team");
// const {HeroEvents} = require("../role/hero");
const {EffectAndAttrCarrierLifeEvent} = require("../../effect/effectAndAttrCarrier");
const logger = require("../../../log/logger");

const {HeroEvents,BattleEvents}=require("../lifeCycle");
const {delegateEvent} = require("../../util/event");

const BattleStatus ={
    INIT:0, //初始化
    ING:1, //进行中
    END:2, //结束
    TIMEOUT:3, //超时
};

const MAX_BATTLE_TURN = 20; //最大回合数


/**
 * 将对象的副本形式保留下来
 * @param obj
 * @returns {*}
 */
function pojo(obj) {
    if(obj !== undefined && obj !== null && obj.toJSONObject){
        return obj.toJSONObject({serializeLevel:1})
    }else{
        return obj;
    }
}


let Action = oop.defineClass({
    super:undefined,
    constructor:function({
    
        who,//发动动作的hero (如果是系统事件（比如回合开始)则是空 )
        
        eventCode,//事件编码（通过这个可以区分是什么类型的事件）
        
        param,//事件参数。比如事件是 技能释放的话，这里应该存技能对象（这个对象必须实现 toJSONObject 方法）
    }){
        var self = this;
        
        self.eventCode = eventCode,
        self.who = pojo(who);
        self.param = pojo(param);
    },
    prototype:{
        //将对象内容完全转化为不附带循环引用的纯对象
        toJSONObject:function () {
            var self = this;
            return {
                eventCode:self.eventCode,
                who:self.who, //只需要最简单的英雄信息，用于界面展示
                param:self.param,
            }
            // return {
            //     eventCode:self.eventCode,
            //     who:self.who?self.who.toJSONObject({serializeLevel:1}):undefined, //只需要最简单的英雄信息，用于界面展示
            //     param:self.param?( self.param.toJSONObject?self.param.toJSONObject({serializeLevel:1}):self.param ):undefined,
            // }
        },
        toString:function () {
            var self = this;
            return `事件编码[${self.eventCode}]`;
        }
    }
});

const MUTATION_TYPE={
    ATTR_CHANGE:1, //属性变化
    EFFECT_ADDED:2, //效果添加
    EFFECT_REMOVED:3, //效果删除
};

//表示一次对象的更新。根据type不同，构造函数中可能出现的值也不同
let Mutation = oop.defineClass({
    super:undefined,
    constructor:function({
        type,//mutation 类型，见 `MUTATION_TYPE`
        who,//发生变化的对象
        from, //变化发生的来源对象（攻击者、帮助者等）
         remark,//备注信息
        effect,//被添加/移除的效果 【type!=ATTR_CHANGE时有效】
        
        attr,//发生变化的属性  【type==ATTR_CHANGE时有效】
        attrChanged,//属性变化量(+-)  【type==ATTR_CHANGE时有效】
        attrTotal,
    }){
        var self = this;
        
        self.type = pojo(type);
        self.remark = pojo(remark);
        self.who = pojo(who);
        self.from = pojo(from);
        self.effect = pojo(effect);
        self.attr = pojo(attr);
        self.attrChanged = pojo(attrChanged);
        self.attrTotal = pojo(attrTotal);
        
    },
    prototype:{
    
        //将对象内容完全转化为不附带循环引用的纯对象
        toJSONObject:function () {
            var self = this;
            return {
                type:self.type,
                remark:self.remark,
                who:self.who,
                from:self.from,
                effect:self.effect,
                attr:self.attr,
                // attr:self.attr===undefined?undefined:self.attr.name,
                attrChanged:self.attrChanged,
                attrTotal:self.attrTotal
            }
            // return {
            //     type:self.type,
            //     remark:self.remark,
            //     who:self.who.toJSONObject({serializeLevel:1}),
            //     from:self.from?self.from.toJSONObject({serializeLevel:1}):undefined,
            //     effect:self.effect===undefined?undefined:self.effect.toJSONObject({serializeLevel:1}),
            //     attr:self.attr,
            //     // attr:self.attr===undefined?undefined:self.attr.name,
            //     attrChanged:self.attrChanged===undefined?undefined:self.attrChanged,
            //     attrTotal:self.attrTotal===undefined?undefined:self.attrTotal
            // }
        },
        toString:function () {
            var self = this;
            let desc=undefined;
            
            //如果是属性变化
            if(self.type === MUTATION_TYPE.ATTR_CHANGE){
                desc=`[${self.who.name}].[${self.effect.name}]${self.attrChanged}`;
            }
            else{
                if(self.type === MUTATION_TYPE.EFFECT_ADDED){
                    desc = `[${self.who.name}]受到[${effect.name}]效果影响中`;
                }else{
                    desc = `[${self.who.name}]身上的[${effect.name}]效果消失`;
                }
            }
            
            return desc;
        }
    }
});
/**
 * 战斗细节记录，忠实记录战斗过程，方便回看
 */
let BattleDetail =oop.defineClass({
    super:undefined,
    constructor:function({
        battle //所属的战斗对象
    }){
        var self = this;
        self.battle = battle;
        
        //战斗记录明细。3维数组
        //1维：一个记录是一个回合数组（2维）
        //2维：一条记录，是一个事件数组，0元素代表一个主动action，以及其后续带来的对世界的变更事件集合（在界面展示上，他们是一个时刻出现的）
        //3维：1个记录，是一个事件，比如回合开始之类，也会作为一个单独的item来记录触发。其后续产生的mutation都归于他下面
        self.ticks=[];
        
        //key:heroId,value:number
        self.report={
            damage:{
                
            }
            ,
            heal:{
                
            }
        };
        
    },
    prototype:{
    
        /**
         * 将对象内容完全转化为不附带循环引用的纯对象
         */
        toJSONObject:function () {
            var self = this;
            var schema={
                attackTeam:self.battle.attackTeam.toJSONObject({serializeLevel:1}),
                defendTeam:self.battle.defendTeam.toJSONObject({serializeLevel:1}),
                ticks:[],
                report:self.report,
            };
            
            schema.ticks = self.ticks.map((tickArray)=>{
                return tickArray.map((turn)=>{
                    return turn.map((tick)=>{
                        return tick.toJSONObject();
                    });
                });
            });
            //
            return schema;
        },
        addAction:function (
            eventCode,
            who,//发动动作的hero
            param//事件参数
        ) {
            var self = this;
            let action = new Action({who,eventCode,param});
            
            //非回合开始事件
            if(eventCode !== BattleEvents.TURN_BEGIN && eventCode !== BattleEvents.BATTLE_BEGIN ){
                self.ticks[self.ticks.length-1].push([action]); //新开一个时间刻度，起始是触发该时刻的action
            }else{
                self.ticks.push([[action]]);
            }
            
        },
        addMutation:function (
            remark,//备注信息
            type,//mutation 类型，见 `MUTATION_TYPE`
            who,//发生变化的对象
            from, //变化发生的来源对象（攻击者、帮助者等）
    
            effect,//被添加/移除的效果 【type!=ATTR_CHANGE时有效】
    
            attr,//发生变化的属性  【type==ATTR_CHANGE时有效】
            attrChanged,//属性变化量(+-)  【type==ATTR_CHANGE时有效】
            curTotal //变化后的属性值 (当前存在属性上下限的时候，attrChanged仍然保留希望更新的数值，而curTotal表示更新后的实际总值)
        ) {
            var self = this;
            let mutation = new Mutation({
                type,
                remark,
                who,
                from,
                effect,
                attr,
                attrChanged,
                attrTotal:curTotal,
            });
            let curTurn =self.ticks[self.ticks.length-1];
            curTurn[curTurn.length-1].push(mutation); //当前时刻事件的末尾，追加mutation
        }
    }
});

/**
 * 战斗，战斗结束之后，这个对象直接销毁
 * 战斗过程中会产生BattleRecord对象
 */
let Battle = oop.defineClass({
    super:undefined,
    constructor:function({
        id, //战斗记录编号
        type, //战斗类型
        attackTeam=undefined, //攻方队伍
        defendTeam=undefined //防守方队伍
    }){
        var self = this;
    
        event.mixin(self);
        
        self.status = BattleStatus.INIT;
        self.id = id;
        self.type = type;
        self.createTime = new Date();
        self.attackTeam = attackTeam.joinBattle(self,true);
        
        self.defendTeam = defendTeam.joinBattle(self,false);
        
        //控制战斗过程
        self.process={
            turns:0, //当前回合。1代表第一回合
            activeQueue:[] ,//行动队列,保存当前回合已经完成的动作
        };
        
        self.winner = undefined;
        
        self.battleDetail = new BattleDetail({battle:self});
        
        self.init();
        
    },
    prototype:{
    
        /**
         * 将对象内容完全转化为不附带循环引用的纯对象
         */
        toJSONObject:function () {
            var self = this;
            var schema={
                id:self.id,
                time:self.createTime,
                attacker:self.attackTeam.player.toJSONObject({serializeLevel:1}),
                defender:self.defendTeam.player.toJSONObject({serializeLevel:1}),
                winner:self.winner?self.winner.heros[0].context.account:undefined,
                detail:self.battleDetail.toJSONObject()
            };
            
            return schema;
        },
    
        /**
         * 将对象完全序列化
         * @param options
         */
        toJSONString:function () {
            var self = this;
            return JSON.stringify(self.toJSONObject());
        },
    
        /**
         * 初始化战斗
         */
        init:function () {
            var self = this;
            
            //监听队伍的团灭事件
            self.attackTeam.on(TeamEvents.DEFEATED,()=>{
                self.winner = self.defendTeam;
                self.status = BattleStatus.END;
            });
            self.defendTeam.on(TeamEvents.DEFEATED,()=>{
                self.winner = self.attackTeam;
                self.status = BattleStatus.END;
            });
            
            self.on(BattleEvents.TURN_BEGIN,function (curTurn) {
                self.battleDetail.addAction(BattleEvents.TURN_BEGIN,undefined,curTurn);
            });
           
            self.on(BattleEvents.TURN_END,function (curTurn) {
                self.battleDetail.addAction(BattleEvents.TURN_END,undefined,curTurn);
            });
            self.on(BattleEvents.BATTLE_BEGIN,function () {
                self.battleDetail.addAction(BattleEvents.BATTLE_BEGIN,undefined,undefined);
            });
           
            self.on(BattleEvents.BATTLE_END,function () {
                self.battleDetail.addAction(BattleEvents.BATTLE_END,undefined,undefined);
            });
           
            
            // let _handleAttrChange=function (who,attr,oldTotal,newTotal) {
            let _handleAttrChange=function (remark,who,attr,changed,curTotal) {
                // self.battleDetail.addMutation(MUTATION_TYPE.ATTR_CHANGE,who,undefined,undefined,attr,newTotal-oldTotal);
                self.battleDetail.addMutation(remark,MUTATION_TYPE.ATTR_CHANGE,who,undefined,undefined,attr,changed,curTotal);
            };
            let _handleEffectAdd=function (who,from,effect) {
                self.battleDetail.addMutation(undefined,MUTATION_TYPE.EFFECT_ADDED,who,from,effect);
            };
            let _handleEffectRemove=function (who,from,effect) {
                self.battleDetail.addMutation(undefined,MUTATION_TYPE.EFFECT_REMOVED,who,from,effect);
            };
            let _handleReleaseSkill=function (event,who,skillToRelease) {
                //增加作战记录，某个英雄开始行动
                self.battleDetail.addAction(event,who,skillToRelease);
            };
    
    
            /**
             * 构造一个可以序列化自身的躲闪事件对象（这样是为了减少内存里每个对象都保存toJSONObject的开销
             * @param attacker
             * @param effect
             * @constructor
             */
            function FleeParam({attacker,effect}) {
                var self = this;
                
                self.attacker = attacker;
                self.effect = effect;
            }
            FleeParam.prototype.toJSONObject=function({serializeLevel}){
                return {
                    attacker:this.attacker.toJSONObject({serializeLevel}),
                    effect:this.effect.toJSONObject({serializeLevel}),
                }
            };
            function MissParam({missWho,effect}) {
                var self = this;
                
                self.missWho = missWho;
                self.effect = effect;
            }
            MissParam.prototype.toJSONObject=function({serializeLevel}){
                return {
                    missWho:this.missWho.toJSONObject({serializeLevel}),
                    effect:this.effect.toJSONObject({serializeLevel}),
                }
            };
            /**
             *
             * @param event
             * @param who
             * @param attacker:躲避的谁的攻击
             * @param effect：躲避掉的效果
             * @private
             */
            let _handleFlee=function (event,who,attacker,effect) {
                //增加作战记录，某个英雄开始行动
                self.battleDetail.addAction(event,who,new FleeParam({attacker,effect}));
            };
            /**
             *
             * @param event
             * @param who
             * @param missWho:没有打中谁
             * @param effect：Miss的效果
             * @private
             */
            let _handleMiss=function (event,who,missWho,effect) {
                //增加作战记录，某个英雄开始行动
                self.battleDetail.addAction(event,who,new MissParam({missWho,effect}));
            };
            let _handleDie=function (event,who) {
                //增加作战记录，某个英雄死亡
                self.battleDetail.addAction(event,who);
            };
            let _handleReborn=function (event,who) {
                //增加作战记录，某个英雄死亡
                self.battleDetail.addAction(event,who);
            };
            let _handleMutation=function (from,mutation,to,remark,mutationResult) {
                // from = from.source;
            
                    
                //筛选出对Hp的增加、减少操作，记录输出、治疗量汇总数据
                if(mutation.hasOwnProperty(HeroOtherAttributes.HP)){
                    let changed = mutation[HeroOtherAttributes.HP];
                    if(changed<0){
                        self.battleDetail.report.damage[from.id] = +(self.battleDetail.report.damage[from.id]||0)+ Math.abs(changed);
                    }else{
                        self.battleDetail.report.heal[from.id] = +(self.battleDetail.report.heal[from.id]||0)+ Math.abs(changed);
                    }
                }
                //只记录:hp,sp相关属性变化日志
                for(var p in mutation){
                    if(
                        p === HeroOtherAttributes.HP ||
                        p === HeroDeriveAttributes.HP_MAX ||
                        p === HeroOtherAttributes.SP ||
                        p === HeroOtherAttributes.SP_MAX
                    ){
                        _handleAttrChange(remark,to,p,mutation[p],mutationResult[p]);
                    }
                }
            };
            
            //监听战场所有成员的属性改变事件、effect事件、释放技能事件
            self.attackTeam.heros.forEach((hero)=>{
                hero.on(HeroEvents.BEFORE_ACTION,function(skillToRelease){
                    _handleReleaseSkill(HeroEvents.BEFORE_ACTION,this,skillToRelease);
                });
                hero.on(EffectAndAttrCarrierLifeEvent.AFTER_INSTALL_EFFECT,function(source,ef){
                    _handleEffectAdd(this,source,ef);
                });
                hero.on(EffectAndAttrCarrierLifeEvent.BEFORE_UNINSTALL_EFFECT,function(ef){
                    _handleEffectRemove(this,ef.source,ef);
                });
                hero.on(HeroEvents.AFTER_MUTATION,function(from,mutation,remark,mutationResult){
                    _handleMutation(from,mutation,this,remark,mutationResult);
                });
                hero.on(HeroEvents.AFTER_HERO_MISS,function(missWho,effect){
                    _handleMiss(HeroEvents.AFTER_HERO_MISS,this,missWho,effect);
                });
                hero.on(HeroEvents.AFTER_HERO_FLEE,function(attacker,effect){
                    _handleFlee(HeroEvents.AFTER_HERO_FLEE,this,attacker,effect);
                });
                hero.on(HeroEvents.AFTER_HERO_DIE,function(){
                    _handleDie(HeroEvents.AFTER_HERO_DIE,this);
                });
                hero.on(HeroEvents.AFTER_HERO_REBORN,function(){
                    _handleReborn(HeroEvents.AFTER_HERO_REBORN,this);
                });
                // hero.on("attrChange",function(attr,total,raw,modify,val,oldTotal){
                //
                //     //只记录:hp,sp相关属性变化日志
                //     if(
                //         attr.name ===HeroOtherAttributes.HP ||
                //         attr.name === HeroDeriveAttributes.HP_MAX ||
                //         attr.name === HeroOtherAttributes.SP ||
                //         attr.name === HeroOtherAttributes.SP_MAX
                //     ){
                //         _handleAttrChange(this,attr,oldTotal,total);
                //     }
                // });
                
                //代理内部hero的所有事件
                // hero.on("*",function () {
                //     let args = [].slice.call(arguments);
                //     self.emit.apply(self,args);
                // });
                delegateEvent(hero,self);
            });
            self.defendTeam.heros.forEach((hero)=>{
                hero.on(HeroEvents.BEFORE_ACTION,function(skillToRelease){
                    _handleReleaseSkill(HeroEvents.BEFORE_ACTION,this,skillToRelease);
                });
                hero.on(EffectAndAttrCarrierLifeEvent.AFTER_INSTALL_EFFECT,function(source,ef){
                    _handleEffectAdd(this,source,ef);
                });
                hero.on(EffectAndAttrCarrierLifeEvent.AFTER_UNINSTALL_EFFECT,function(source,ef){
                    _handleEffectRemove(this,source,ef);
                });
                
                // hero.on("attrChange",function(attr,total,raw,modify,val,oldTotal){
                //
                //     //只记录:hp,sp相关属性变化日志
                //     if(
                //         attr.name ===HeroOtherAttributes.HP ||
                //         attr.name === HeroDeriveAttributes.HP_MAX ||
                //         attr.name === HeroOtherAttributes.SP ||
                //         attr.name === HeroOtherAttributes.SP_MAX
                //     ){
                //         _handleAttrChange(this,attr,oldTotal,total);
                //     }
                // });
                hero.on(HeroEvents.AFTER_MUTATION,function(from,mutation,remark,mutationResult){
                    _handleMutation(from,mutation,this,remark,mutationResult);
                });
    
                hero.on(HeroEvents.AFTER_HERO_MISS,function(missWho,effect){
                    _handleMiss(HeroEvents.AFTER_HERO_MISS,this,missWho,effect);
                });
                hero.on(HeroEvents.AFTER_HERO_FLEE,function(attacker,effect){
                    _handleFlee(HeroEvents.AFTER_HERO_FLEE,this,attacker,effect);
                });
                hero.on(HeroEvents.AFTER_HERO_DIE,function(){
                    _handleDie(HeroEvents.AFTER_HERO_DIE,this);
                });
    
                hero.on(HeroEvents.AFTER_HERO_REBORN,function(){
                    _handleReborn(HeroEvents.AFTER_HERO_REBORN,this);
                });
                //代理内部hero的所有事件
                // hero.on("*",function () {
                //     let args = [].slice.call(arguments);
                //     self.emit.apply(this,args);
                // });
                delegateEvent(hero,self);
            });
        },
        /**
         * 获取who的对手队伍
         * @param who
         */
        getEnemyTeam:function (who) {
            if(this.attackTeam.id === who.id){
                return this.defendTeam;
            }else if(this.defendTeam.id === who.id){
                return this.attackTeam;
            }else{
                return undefined; //who 并不在这场战斗中
            }
        },
    
        /**
         * 下一个回合
         */
        nextTurn:function () {
            var self = this;
    
            
            //增加回合数
            self.process.turns++;
            logger.debug(`\r\n \r\n 准备开始第${self.process.turns}回合\r\n`);
            //回合开始
            self.emit(BattleEvents.TURN_BEGIN,self.process.turns);
    
            //初始化当前回合已行动队列
            self.process.activeQueue=[];
            
            //决定下一个行动人
            while (self.status !== BattleStatus.END){
                // logger.debug(`准备选择 下一个行动人`);
                let nextActor = self.chooseNextActorHero();
    
                if(nextActor){
                    logger.debug(`\r\n下一人准备行动:${nextActor.toString()}`);
                    //拿到行动人，让行动人开始action，进行动作
                    nextActor.startAction();
                    //行动完毕的Hero，记录到已行动队列
                    self.process.activeQueue.push(nextActor);
        
                }else{
                    //如果没有行动人，说明这一个回合该结束了
                    logger.debug(`准备结束第${self.process.turns}回合 \r\n \r\n`);
                    //回合结束
                    self.emit(BattleEvents.TURN_END,self.process.turns);
                    break;
                }
            }
            
    
        },
    
        /**
         * 选出下一个行动人
         */
        chooseNextActorHero:function () {
            var self = this;
            //选出人物可以行动的列表
            let canActionHeros = self.attackTeam.findHero(function (hero) {
                return hero.canAction();
            });
            
            // logger.debug(`攻击方，可以行动的有${canActionHeros.length}人`);
            
            canActionHeros = canActionHeros.concat(self.defendTeam.findHero(function (hero) {
                return hero.canAction();
            }));
            // logger.debug(`双方合计，可以行动的有${canActionHeros.length}人`);
            
            //选最快的,且当前回合并没有行动过的(注意：列表里，进攻方英雄排列在前面，所以如果2个英雄SPD一样，进攻方英雄优先出手。另外，位置靠前的优先出手)
            let fastestSpeed = 0,
                fastedHero = undefined;
            
            for(var i=0,j=canActionHeros.length;i<j;i++){
                let hero = canActionHeros[i];
                // logger.debug(`评估英雄:[${hero.toString()}]是否可以行动`);
                if(
                    self.process.activeQueue.findIndex((h)=>h===hero) < 0 &&
                    hero.getAttr(HeroDeriveAttributes.SPD).getVal()>fastestSpeed
                ){
                    fastedHero = hero;
                    fastestSpeed = hero.getAttr(HeroDeriveAttributes.SPD).getVal();
                    // logger.debug(`更改英雄:[${hero.toString()}]为优先行动人`);
                }
            }
            
            return fastedHero;
           
        },
        
        /**
         * 开始运行battle，一直到结束
         */
        run:function () {
            var self = this;
    
            logger.debug("战斗开始");
            //战斗开始
            self.emit(BattleEvents.BATTLE_BEGIN);
            
            //只要战斗没有结束，没有超时，就继续下一回合
            while (self.status !== BattleStatus.END && self.status !== BattleStatus.TIMEOUT){
                self.nextTurn();
                
                //判断超时
                if(self.process.turns === MAX_BATTLE_TURN){
                    self.status = BattleStatus.TIMEOUT;
                }
            }
    
            logger.debug(`战斗结束,状态=${self.status}`);
            //战斗结束
            self.emit(BattleEvents.BATTLE_END);
            
            
            //队伍离开战斗
            self.attackTeam.quitBattle();
            self.defendTeam.quitBattle();
            
            return undefined;
        }
    
    }
});

module.exports={Battle,BattleEvents,BattleDetail};