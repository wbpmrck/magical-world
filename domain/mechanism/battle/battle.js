/** 定义战斗相关的流程和规则
 * Created by kaicui on 17/10/8.
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const {HeroBaseAttributes,HeroOtherAttributes,HeroDeriveAttributes} = require("../role/attributeRule");
const {TeamEvents} = require("./team");
const {HeroEvents} = require("../role/hero");
const {EffectAndAttrCarrierLifeEvent} = require("../../effect/effectAndAttrCarrier");

const BattleEvents=require("../lifeCycle").BattleEvents;

const BattleStatus ={
    INIT:0, //初始化
    ING:1, //进行中
    END:2, //结束
    TIMEOUT:3, //超时
};

const MAX_BATTLE_TURN = 20; //最大回合数


let Action = oop.defineClass({
    super:undefined,
    constructor:function({
        who,//发动动作的hero
        skill,//发动的技能
    }){
        var self = this;
        
        self.who = who;
        self.skill = skill;
    },
    prototype:{
        toString:function () {
            var self = this;
            return `[${self.who.name}]发动[${self.skill.name}]`;
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
        
        effect,//被添加/移除的效果 【type!=ATTR_CHANGE时有效】
        
        attr,//发生变化的属性  【type==ATTR_CHANGE时有效】
        attrChanged,//属性变化量(+-)  【type==ATTR_CHANGE时有效】
    }){
        var self = this;
        
        self.type = type;
        self.who = who;
        self.from = from;
        self.effect = effect;
        self.attr = attr;
        self.attrChanged = attrChanged;
        
    },
    prototype:{
    
        toString:function () {
            var self = this;
            let desc=undefined;
            
            //如果是属性变化
            if(self.type === MUTATION_TYPE.ATTR_CHANGE){
                desc=`[${self.who.name}]发动[${self.skill.name}]`;
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
        
        //战斗记录明细。2维数组
        // 一条明细，是一个数组，0元素代表一个主动action，以及其后续带来的对世界的变更事件集合（在界面展示上，他们是一个时刻出现的）
        //一些特殊事件，比如回合开始之类，也会作为一个单独的item来记录触发。其后续产生的mutation都归于他下面
        self.ticks=[];
        
    },
    prototype:{
        addAction:function (
            who,//发动动作的hero
            skill//发动的技能
        ) {
            var self = this;
            let action = new Action({who,skill});
            self.ticks.push([action]); //新开一个时间刻度，起始是触发该时刻的action
        },
        addMutation:function (
            type,//mutation 类型，见 `MUTATION_TYPE`
            who,//发生变化的对象
            from, //变化发生的来源对象（攻击者、帮助者等）
    
            effect,//被添加/移除的效果 【type!=ATTR_CHANGE时有效】
    
            attr,//发生变化的属性  【type==ATTR_CHANGE时有效】
            attrChanged//属性变化量(+-)  【type==ATTR_CHANGE时有效】
        ) {
            var self = this;
            let mutation = new Mutation({
                type,
                who,
                from,
                effect,
                attr,
                attrChanged,
            });
            self.ticks[self.ticks.length-1].push(mutation); //当前时刻事件的末尾，追加mutation
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
        
        self.status = BattleStatus.INIT;
        self.id = id;
        self.type = type;
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
           
            
            let _handleAttrChange=function (who,attr,oldTotal,newTotal) {
                self.battleDetail.addMutation(MUTATION_TYPE.ATTR_CHANGE,who,undefined,undefined,attr,newTotal-oldTotal);
            };
            let _handleEffectAdd=function (who,from,effect) {
                self.battleDetail.addMutation(MUTATION_TYPE.EFFECT_ADDED,who,from,effect);
            };
            let _handleEffectRemove=function (who,from,effect) {
                self.battleDetail.addMutation(MUTATION_TYPE.EFFECT_REMOVED,who,from,effect);
            };
            let _handleReleaseSkill=function (who,skillToRelease) {
                //增加作战记录，某个英雄开始行动
                self.battleDetail.addAction(who,skillToRelease);
            };
            
            //todo:监听战场所有成员的属性改变事件、effect事件、释放技能事件
            self.attackTeam.heros.forEach((hero)=>{
                hero.on(HeroEvents.BEFORE_ACTION,function(skillToRelease){
                    _handleReleaseSkill(this,skillToRelease);
                });
                hero.on(EffectAndAttrCarrierLifeEvent.AFTER_INSTALL_EFFECT,function(context,source,ef){
                    _handleEffectAdd(this,source,ef);
                });
                hero.on(EffectAndAttrCarrierLifeEvent.AFTER_UNINSTALL_EFFECT,function(ef){
                    _handleEffectRemove(this,ef.source,ef);
                });
                hero.on("attrChange",function(attr,total,raw,modify,val,oldTotal){
                    _handleAttrChange(this,attr,oldTotal,total);
                });
                
                //代理内部hero的所有事件
                hero.on("*",function () {
                    let args = [].slice.call(arguments);
                    self.emit.apply(this,args);
                });
            });
            self.defendTeam.heros.forEach((hero)=>{
                hero.on(HeroEvents.BEFORE_ACTION,function(skillToRelease){
                    _handleReleaseSkill(this,skillToRelease);
                });
                hero.on(EffectAndAttrCarrierLifeEvent.AFTER_INSTALL_EFFECT,function(context,source,ef){
                    _handleEffectAdd(this,source,ef);
                });
                hero.on(EffectAndAttrCarrierLifeEvent.AFTER_UNINSTALL_EFFECT,function(ef){
                    _handleEffectRemove(this,ef.source,ef);
                });
                hero.on("attrChange",function(attr,total,raw,modify,val,oldTotal){
                    _handleAttrChange(this,attr,oldTotal,total);
                });
                //代理内部hero的所有事件
                hero.on("*",function () {
                    let args = [].slice.call(arguments);
                    self.emit.apply(this,args);
                });
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
            //回合开始
            self.emit(BattleEvents.TURN_BEGIN);
    
            //初始化当前回合已行动队列
            self.process.activeQueue=[];
            
            //决定下一个行动人
            while (self.status !== BattleStatus.END){
                let nextActor = self.chooseNextActorHero();
    
                if(nextActor){
                    //拿到行动人，让行动人开始action，进行动作
                    nextActor.startAction();
                    //行动完毕的Hero，记录到已行动队列
                    self.process.activeQueue.push(nextActor);
        
                }else{
                    //如果没有行动人，说明这一个回合该结束了
                    //回合结束
                    self.emit(BattleEvents.TURN_END);
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
            
            canActionHeros = canActionHeros.concat(self.defendTeam.findHero(function (hero) {
                return hero.canAction();
            }));
            
            //选最快的,且当前回合并没有行动过的(注意：列表里，进攻方英雄排列在前面，所以如果2个英雄SPD一样，进攻方英雄优先出手。另外，位置靠前的优先出手)
            let fastestSpeed = 0,
                fastedHero = undefined;
            
            for(var i=0,j=canActionHeros.length;i<j;i++){
                let hero = canActionHeros[i];
                if( self.process.activeQueue.findIndex((h)=>h===hero)>-1 && hero.getAttr(HeroDeriveAttributes.SPD).getVal()>fastestSpeed){
                    fastedHero = hero;
                }
            }
            
            return fastedHero;
           
        },
        
        /**
         * 开始运行battle，一直到结束
         */
        run:function () {
            var self = this;
            
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

            //战斗结束
            self.emit(BattleEvents.BATTLE_END);
            
            return undefined; //todo:以后需要输出一个战斗报告
        }
    
    }
});

module.exports={Battle,BattleEvents,BattleDetail};