/**
 * Created by kaicui on 17/8/5.
 */


const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {Hero} = require("./hero");


describe("Hero", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can work", function () {
        let hero1 = new Hero({
            levelCur:0, //number,或者Integer 对象，表示当前等级
            levelMax:4, //number,或者Integer 对象，表示最高等级
            exp:0, // number,表示当前获得的经验值
        },{
            id:1,//英雄id
            name:"stormWarrior",//英雄名称
            raceCampCode:1, //种族&阵营编号
            jobCode:1, //职业编号
            starLevel:1,//number,星数
            rawAttributes:{
                STR:10,
                AGI:20,
                VIT:30,
                INT:40,
                DEX:50,
                LUK:60
            }
        });
        
       
        //验证基本信息，阵营等
        expect(hero1.id).to.eq(1);
        expect(hero1.name).to.eq('stormWarrior');
        expect(hero1.camp.getRaceCode()).to.eq(1);
        expect(hero1.camp.getRaceName()).to.eq('LIGHT');
        expect(hero1.camp.getCampCode()).to.eq(1);
        expect(hero1.camp.getCampName()).to.eq('JUSTICE');
    
        expect(hero1.job.code).to.eq(1);
        expect(hero1.job.name).to.eq('WARRIOR');
    
    
        //验证星级
        let star1= hero1.star;
        expect(star1.level).to.eq(1);
        star1.levelUp();
        expect(star1.level).to.eq(2);
    
        star1.once("beforeUp",function(oldLevel,newLevel){
            expect(oldLevel).to.eq(2);
            expect(newLevel).to.eq(3);
            //模拟升星的时候增加属性
            
        });
        let success = star1.levelUp();
        expect(star1.level).to.eq(3);
        expect(success).to.eq(true);
    
        let success2 = star1.levelUp();
        let success3 = star1.levelUp();
        let success4 = star1.levelUp();
        expect(success2).to.eq(true);
        expect(success3).to.eq(true);
        expect(success4).to.eq(false);
        
        
        //验证升级功能
        expect(hero1.canLevelUp()).to.eql(false);
    
        hero1.acquireExp(21); //need 1 to arrive level1
        expect(hero1.exp).to.eql(21);
        expect(hero1.canLevelUp()).to.eql(false);
        hero1.acquireExp(1); // arrive level1
        expect(hero1.exp).to.eql(22);
        expect(hero1.canLevelUp()).to.eql(true);
    
        //level up and dec the exp
        hero1.levelUp();
        expect(hero1.exp).to.eql(0);
        expect(hero1.levelCur.val.raw).to.eql(1);
        expect(hero1.levelCur.val.total()).to.eql(1);
    
    
        //验证属性
    
        expect(hero1.getAttr("STR").getVal()).to.eql(10);
        expect(hero1.getAttr("AGI").getVal()).to.eql(20);
        expect(hero1.getAttr("VIT").getVal()).to.eql(30);
        expect(hero1.getAttr("INT").getVal()).to.eql(40);
        expect(hero1.getAttr("DEX").getVal()).to.eql(50);
        expect(hero1.getAttr("LUK").getVal()).to.eql(60);
    
    
        expect(hero1.getAttr("ATK").getVal()).to.gt(0);
        expect(hero1.getAttr("HP_MAX").getVal()).to.gt(0);
        expect(hero1.getAttr("M_ATK").getVal()).to.gt(0);
        expect(hero1.getAttr("DEF").getVal()).to.gt(0);
        expect(hero1.getAttr("M_DEF").getVal()).to.gt(0);
        expect(hero1.getAttr("SPD").getVal()).to.gt(0);
        expect(hero1.getAttr("FLEE").getVal()).to.gt(0);
        expect(hero1.getAttr("HIT").getVal()).to.gt(0);
        expect(hero1.getAttr("CRI").getVal()).to.gt(0);
    });
  
    
});
