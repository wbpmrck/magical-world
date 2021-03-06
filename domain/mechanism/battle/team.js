/** 定义 team
 * Created by kaicui on 17/10/8.
 *
 * 1、一个team是一个作战单位，他也有自己的属性和状态，比如"团队光环"，以后也可能有更多
 * 2、team在开始作战的时候，被拉入战场
 * 3、team负责选出自己下一个行动hero
 * 4、team负责记录自己当前进行到哪一轮次（回合数）
 *
 * 注意：
 * 1、team里保存英雄的副本，每一个进入team的英雄，与卡池中英雄共享同样的装备、属性。但是hp,怒气值，状态列表等信息是自己独有的
 * 2、一般的对战，team只在开始战斗后生成，战斗结束之后解散
 * 3、远征这种，队伍信息会保存到数据库，每次登录之后重新初始化
 * 4、用户在每一类场景中的偏好队伍构成，在其他地方保存（只需要保存场景id,位置id对应的英雄id即可）
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const {HeroEvents} = require("../role/hero");
const {HeroBaseAttributes,HeroOtherAttributes,HeroDeriveAttributes} = require("../role/attributeRule");

// const {delegateEvent} = require("../../util/event");
let iota=1000;
const TeamEvents={
    DEFEATED:iota++, //队伍团灭
};

//队伍在战斗中的角色
const TeamRole={
    NONE:0,
    ATTACKER:1,
    DEFENDER:2,
}

/**
 * 2017年10月30日：
 * 一个队伍，目前设计为只和英雄有关系，和player没有直接关系。
 *
 * todo:以后可能允许不同player的英雄一起组成一个队伍
 */
let Team = oop.defineClass({
    super:undefined,
    constructor:function({
        id,//队伍编号
        heros,//玩家组成队伍的英雄列表。数组。0~5分别代表所处位置，前(2)->中(2)->后(2)
    }){
        var self = this;
        event.mixin(self);
        
        self.id = id;
        self.heros=heros;
        
        self.player = self.heros[0].context;//todo:暂时以第一个英雄所属的玩家，来代表这个队伍
        
        self.heros.forEach((hero)=>{
           hero.joinTeam(self);
           
           hero.on(HeroEvents.AFTER_HERO_DIE,(dead)=>{
              self.checkTeamDefeat();
           });
        });
        
        self.battle = undefined;// 一个队伍一个时刻，只能存在于一场战斗中
        self.role = TeamRole.NONE;
        
    },
    prototype:{
        //将对象内容完全转化为不附带循环引用的纯对象
        toJSONObject:function ({serializeLevel}) {
            var self = this;
            return {
                id:self.id,
                heros:self.heros.map((h)=>{return h.toJSONObject({serializeLevel})}),
                role:self.role,
                player:self.player.toJSONObject({serializeLevel})
            }
        },
        toString:function () {
          return `team:[${this.id}],heros:[${this.heros.map( (h)=>h.toString() )}]`
        },
        /**
         * 检查队伍是否全灭，全灭的话，向外部抛事件
         */
        checkTeamDefeat:function () {
            var self = this;
            
            for(var i=0,j=self.heros.length;i<j;i++){
                var hero = self.heros[i];
                
                //只要有一个没死透(hp>0 或者还可以重生的)，就没有团灭
                if(!hero.isCompleteDead()){
                    return false;
                }
            }
    
            self.emit(TeamEvents.DEFEATED,self);
            return true;
        },
    
        /**
         * 返回符合条件的hero
         * @param filter
         * @returns {Array.<T>|*}
         */
        findHero:function (filter) {
          return this.heros.filter(filter);
        },
        /**
         * 加入一场战斗
         * @param battle
         * @param isAttacker:true代表是进攻方，否则是防守方
         */
        joinBattle:function (battle,isAttacker) {
            var self = this;
            self.battle = battle; //加入战斗
            self.role = isAttacker?TeamRole.ATTACKER:TeamRole.DEFENDER; //确定角色
            
            //加入战斗之后，player代理battle的事件。这样hero的skill就可以正确捕获对应事件
            self.player.watch(battle);
            
            return self;
        },
      
        /**
         * 离开战斗
         */
        quitBattle:function () {
            var self = this;
    
            self.player.unWatch(self.battle);
            
            
            for(var i=0,j=self.heros.length;i<j;i++){
                var hero = self.heros[i];
                hero.removeBattleEffects();
            }
            //todo:为了防止战斗结果报告里找不到role,这逻辑先改为异步更新了
            setTimeout(function () {
                self.battle = undefined;
                self.role = TeamRole.NONE;
            },200);
    
         
            return self;
        }
        
    }
});

module.exports={Team,TeamEvents};