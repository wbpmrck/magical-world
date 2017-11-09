/**
 * Created by kaicui on 17/8/5.
 */

const event = require("local-libs").event;
const expect = require('chai').expect;
const status = require("./status");
const statusEnum = require("./statusEnum");
const integer = require("../../value/integer");

const {EffectEvents} = require("../effect");
const {WordLifeCycle,CharLifeCycle} = require("../../mechanism/lifeCycle");
const  {Hero,HeroEvents} = require("../../mechanism/role/hero");
const {HeroBaseAttributes,HeroOtherAttributes} = require("../../mechanism/role/attributeRule");

describe("statusEffect :", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("frozenEffect should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        let frozenEffect = new status({
            level:new integer(1),
            params:{
                status:statusEnum.Frozen, //状态：冰冻
                continueTurn:2, //回合数
                stopAction:true,
                stopSkill:true,
            },
            worldContext
        });
        
        //定义一个模拟的作用对象
        let target = new Hero({
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
                LUK:60,
                [HeroOtherAttributes.HP]:40,
                [HeroOtherAttributes.SP]:50,
                [HeroOtherAttributes.SP_MAX]:50,
                [HeroOtherAttributes.CRI_ATK]:0,
                [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
            }
        });
        
        let source = {};//假的作用源
    
        frozenEffect.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(frozenEffect);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置效果之前，英雄是可以放大招、行动的
        expect(target.canAction()).to.eql(true);
        expect(target.canBigSkill()).to.eql(true);
    
        target.installEffect(source,frozenEffect);
    
        expect(frozenEffect.toString()).to.eql("效果:[Frozen,stopAction,stopSkill]持续[2/2]回合");
        //放置效果后，英雄不可以放大招、行动
        expect(target.canAction()).to.eql(false);
        expect(target.canBigSkill()).to.eql(false);
        
        
        //模拟经过一个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(frozenEffect.toString()).to.eql("效果:[Frozen,stopAction,stopSkill]持续[1/2]回合");
        expect(target.canAction()).to.eql(false);
        expect(target.canBigSkill()).to.eql(false);
        
        frozenEffect.once(EffectEvents.UNINSTALLED,(ef)=>{
            expect(ef).to.eql(frozenEffect);
            expect(ef.source).to.eql(undefined);
            expect(ef.target).to.eql(undefined);
        });
    
        //模拟经过一个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(target.canAction()).to.eql(true);
        expect(target.canBigSkill()).to.eql(true);
        expect(frozenEffect.toString()).to.eql("效果:[Frozen,stopAction,stopSkill]持续[0/2]回合");
        
    });
    it("Dizzy should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        let dizzy = new status({
            level:new integer(1),
            params:{
                status:statusEnum.Dizzy, //状态：眩晕
                continueTurn:2, //回合数
                stopAction:true,
                stopSkill:true,
            },
            worldContext
        });
        
        //定义一个模拟的作用对象
        let target = new Hero({
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
                LUK:60,
                [HeroOtherAttributes.HP]:40,
                [HeroOtherAttributes.SP]:50,
                [HeroOtherAttributes.SP_MAX]:50,
                [HeroOtherAttributes.CRI_ATK]:0,
                [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
            }
        });
        
        let source = {};//假的作用源
    
        dizzy.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(dizzy);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置效果之前，英雄是可以放大招、行动的
        expect(target.canAction()).to.eql(true);
        expect(target.canBigSkill()).to.eql(true);
    
        target.installEffect(source,dizzy);
    
        expect(dizzy.toString()).to.eql("效果:[Dizzy,stopAction,stopSkill]持续[2/2]回合");
        //放置效果后，英雄不可以放大招、行动
        expect(target.canAction()).to.eql(false);
        expect(target.canBigSkill()).to.eql(false);
        
        
        //模拟经过一个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(dizzy.toString()).to.eql("效果:[Dizzy,stopAction,stopSkill]持续[1/2]回合");
        expect(target.canAction()).to.eql(false);
        expect(target.canBigSkill()).to.eql(false);
        
        dizzy.once(EffectEvents.UNINSTALLED,(ef)=>{
            expect(ef).to.eql(dizzy);
            expect(ef.source).to.eql(undefined);
            expect(ef.target).to.eql(undefined);
        });
    
        //模拟经过一个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(target.canAction()).to.eql(true);
        expect(target.canBigSkill()).to.eql(true);
        expect(dizzy.toString()).to.eql("效果:[Dizzy,stopAction,stopSkill]持续[0/2]回合");
        
    });
    
    it("SILENCE should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        let silence = new status({
            level:new integer(1),
            params:{
                status:statusEnum.SILENCE, //状态：沉默
                continueTurn:2, //回合数
                stopAction:false,
                stopSkill:true,
            },
            worldContext
        });
        
        //定义一个模拟的作用对象
        let target = new Hero({
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
                LUK:60,
                [HeroOtherAttributes.HP]:40,
                [HeroOtherAttributes.SP]:50,
                [HeroOtherAttributes.SP_MAX]:50,
                [HeroOtherAttributes.CRI_ATK]:0,
                [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
            }
        });
        
        let source = {};//假的作用源
    
        silence.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(silence);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置效果之前，英雄是可以放大招、行动的
        expect(target.canAction()).to.eql(true);
        expect(target.canBigSkill()).to.eql(true);
    
        target.installEffect(source,silence);
    
        expect(silence.toString()).to.eql("效果:[SILENCE,stopSkill]持续[2/2]回合");
        //放置效果后，英雄不可以放大招、但是可以行动
        expect(target.canAction()).to.eql(true);
        expect(target.canBigSkill()).to.eql(false);
        
        
        //模拟经过一个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(silence.toString()).to.eql("效果:[SILENCE,stopSkill]持续[1/2]回合");
        expect(target.canAction()).to.eql(true);
        expect(target.canBigSkill()).to.eql(false);
        
        silence.once(EffectEvents.UNINSTALLED,(ef)=>{
            expect(ef).to.eql(silence);
            expect(ef.source).to.eql(undefined);
            expect(ef.target).to.eql(undefined);
        });
    
        //模拟经过一个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(target.canAction()).to.eql(true);
        expect(target.canBigSkill()).to.eql(true);
        expect(silence.toString()).to.eql("效果:[SILENCE,stopSkill]持续[0/2]回合");
        
    });
    
});
