/**  todo:完整的测试战斗流程
 * Created by kaicui on 17/8/5.
 */

const path = require("path");
const fs = require("fs");
const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {Team,TeamEvents} = require("./team");
const {Battle,BattleEvents} = require("./battle");

const {make,ref} = require('../../factory/factory'); //对象构造工厂，通过配置可以构造各种对象



describe("Battle", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can work individually", function () {
        //创建2个玩家
        let player_shinhwa = make({key:"shinhwa"});
        let player_weatherpop = make({key:"weatherpop"});
        
        //先创建2个队伍，每个队伍6个英雄
        let hero1 = make({key:"光战1"}).initOnPlayer(player_shinhwa);
        let hero2 = make({key:"光战1"}).initOnPlayer(player_shinhwa);
        let hero3 = make({key:"光战1"}).initOnPlayer(player_shinhwa);
        let hero4 = make({key:"光战1"}).initOnPlayer(player_shinhwa);
        let hero5 = make({key:"光战1"}).initOnPlayer(player_shinhwa);
        let hero6 = make({key:"光战1"}).initOnPlayer(player_shinhwa);
        
        
        let hero7 = make({key:"地狱游侠1"}).initOnPlayer(player_weatherpop);
        let hero8 = make({key:"地狱游侠1"}).initOnPlayer(player_weatherpop);
        let hero9 = make({key:"地狱游侠1"}).initOnPlayer(player_weatherpop);
        let hero10 = make({key:"地狱游侠1"}).initOnPlayer(player_weatherpop);
        let hero11 = make({key:"地狱游侠1"}).initOnPlayer(player_weatherpop);
        let hero12 = make({key:"地狱游侠1"}).initOnPlayer(player_weatherpop);
        //
        //team1
        let team1 = new Team({
            id:1001,
            heros:[hero1,hero2,hero3,hero4,hero5,hero6],//玩家组成队伍的英雄列表。数组。0~5分别代表所处位置，前(2)->中(2)->后(2)
        });
        let team2 = new Team({
            id:1002,
            heros:[hero7,hero8,hero9,hero10,hero11,hero12],//玩家组成队伍的英雄列表。数组。0~5分别代表所处位置，前(2)->中(2)->后(2)
        });
        
        let battleId = +new Date();
        //battle
        let bat = new Battle({
            id:battleId, //战斗记录编号
            type:1, //战斗类型
            attackTeam:team1, //攻方队伍
            defendTeam:team2//防守方队伍
        });
        
        
        //先输出战斗前日志
        let logDir = path.join(__dirname,`../../../tool/battle/replayer/data`)
    
        let beginfile = path.join(logDir,`battle-${battleId}-begin.json`);
        let endfile = path.join(logDir,`battle-${battleId}-end.json`);
        
        fs.writeFileSync(beginfile,bat.toJSONString());
    
        bat.on(BattleEvents.TURN_BEGIN,function (curTurn) {
            if(curTurn<=3){
                expect(hero1.effects.length).to.eql(2);
            }else{
                //3回合之后，所有英雄身上应该没有效果
                expect(hero1.effects.length).to.eql(0);
            }
        });
        
        bat.run();
      
        
        console.log("winner:"+bat.winner.toString());
        fs.writeFileSync(endfile,bat.toJSONString());
    
        
        //战斗之后，所有英雄身上应该没有效果
        expect(hero1.effects.length).to.eql(0);
        
        // expect(raceCamp3.getCampName()).to.eq('NEUTRAL');
    });
  
    
});
