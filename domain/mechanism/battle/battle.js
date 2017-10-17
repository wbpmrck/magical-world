/** 定义战斗相关的流程和规则
 * Created by kaicui on 17/10/8.
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;


let iota=1000;
const BattleEvents={
    
    BATTLE_BEGIN:iota++,
    BATTLE_END:iota++,
    
    TURN_BEGIN:iota++,
    TURN_END:iota++,
};

const BattleStatus ={
    INIT:0, //初始化
    ING:1, //进行中
    END:2, //结束
    TIMEOUT:3, //超时
};

const MAX_BATTLE_TURN = 20; //最大回合数

/**
 * 战斗记录，忠实记录战斗过程，方便回看
 */
let BattleRecord =oop.defineClass({
    super:undefined,
    constructor:function({}){
        var self = this;
        
        
        
    },
    prototype:{
    
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
        self.attackTeam = attackTeam;
        self.defendTeam = defendTeam;
        
        //控制战斗过程
        self.process={
            turns:0, //当前回合。1代表第一回合
            activeQueue:[] ,//行动队列,保存当前回合已经完成的动作
        }
        
        
    },
    prototype:{
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
            
    
            //回合结束
            self.emit(BattleEvents.TURN_END);
        },
    
        /**todo:
         * 选出下一个行动人
         */
        chooseNextActorHero:function () {
            
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
            }

            //战斗结束
            self.emit(BattleEvents.BATTLE_END);
            
            return undefined; //todo:以后需要输出一个战斗报告
        }
    
    }
});

module.exports={Battle,BattleEvents,BattleRecord};