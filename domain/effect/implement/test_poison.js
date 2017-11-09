/**
 * Created by kaicui on 17/8/5.
 */

const event = require("local-libs").event;
const expect = require('chai').expect;
const poison = require("./poison");
const statusEnum = require("./statusEnum");
const integer = require("../../value/integer");

const {EffectEvents} = require("../effect");
const {WordLifeCycle,CharLifeCycle} = require("../../mechanism/lifeCycle");
const  {Hero,HeroEvents} = require("../../mechanism/role/hero");
const {HeroBaseAttributes,HeroOtherAttributes} = require("../../mechanism/role/attributeRule");


describe("poison :", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("poison should work,with deadly=false, target could not die", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        //制造一个毒素效果（不致死)，每回合造成 基于atk 50%毒素伤害（无视100%防御）（魔法)
        let poisonEffect = new poison({
            level:new integer(1),
            params:{
                continueTurn:2, //回合数
                deadly:false,//此毒素效果不致死
                isMagic:true, //是否魔法攻击（决定计算参数是ATK还是MATK)
                atkRatePerLevel:100,//每提升1级，增加10%伤害
                increase:'linear',//等级提升，atk增长函数
                atkRate:400,// 基础伤害，40%
                ignoreDEF:1000, //无视100%防御（但是仍然收到减伤等因素影响）
            },
            worldContext
        });
        
        //定义作用对象
        let target = new Hero({
            levelCur:1, //number,或者Integer 对象，表示当前等级
            levelMax:4, //number,或者Integer 对象，表示最高等级
            exp:0, // number,表示当前获得的经验值
        },{
            id:1,//英雄id
            name:"stormWarrior",//英雄名称
            raceCampCode:1, //种族&阵营编号
            jobCode:1, //职业编号
            starLevel:1,//number,星数
            rawAttributes:{
                [HeroBaseAttributes.STR]:10,
                [HeroBaseAttributes.AGI]:10,
                [HeroBaseAttributes.VIT]:10,
                [HeroBaseAttributes.INT]:10,
                [HeroBaseAttributes.DEX]:10,
                [HeroBaseAttributes.LUK]:10,
                [HeroOtherAttributes.HP]:10,
                [HeroOtherAttributes.SP]:0,
                [HeroOtherAttributes.SP_MAX]:50,
                [HeroOtherAttributes.CRI_ATK]:0,
                [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
            }
        });
        
        //定义作用源
        let source =  new Hero({
            levelCur:1, //number,或者Integer 对象，表示当前等级
            levelMax:4, //number,或者Integer 对象，表示最高等级
            exp:0, // number,表示当前获得的经验值
        },{
            id:2,//英雄id
            name:"stormWarrior",//英雄名称
            raceCampCode:1, //种族&阵营编号
            jobCode:1, //职业编号
            starLevel:1,//number,星数
            rawAttributes:{
                [HeroBaseAttributes.STR]:10,
                [HeroBaseAttributes.AGI]:10,
                [HeroBaseAttributes.VIT]:10,
                [HeroBaseAttributes.INT]:10,
                [HeroBaseAttributes.DEX]:10,
                [HeroBaseAttributes.LUK]:10,
                [HeroOtherAttributes.HP]:10,
                [HeroOtherAttributes.SP]:0,
                [HeroOtherAttributes.SP_MAX]:50,
                [HeroOtherAttributes.CRI_ATK]:0,
                [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
            }
        });
    
        poisonEffect.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(poisonEffect);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置效果之前，英雄的HP
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
    
        target.installEffect(source,poisonEffect);
    
        expect(poisonEffect.toString()).to.eql("中毒效果(不致死):持续[2/2]回合,每回合造成基于50% M_ATK的伤害,无视%100防御]");
        //身上有效果
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Poison");
        //放置效果后，英雄的HP 不变
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
        
        
        //模拟经过1个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(poisonEffect.toString()).to.eql("中毒效果(不致死):持续[1/2]回合,每回合造成基于50% M_ATK的伤害,无视%100防御]");
        //身上有效果
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Poison");
        //英雄的HP 减少
        
        //m_atk=10+1 = 11
        //50%伤害就是5
        //hp = 10-5 =5
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(5);
        
        //模拟经过2个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(poisonEffect.toString()).to.eql("中毒效果(不致死):持续[0/2]回合,每回合造成基于50% M_ATK的伤害,无视%100防御]");
        //英雄的HP 减少
        
        //m_atk=10+1 = 11
        //50%伤害就是5
        //hp = 5-5 =0 但是因为是不致死，所以=1
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(1);
    
        //效果消失
        expect(poisonEffect.source).to.eql(undefined);
        expect(poisonEffect.target).to.eql(undefined);
        expect(target.effects.length).to.eql(0);
        
    });
    
    it("poison should work,with deadly=true, target could die", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        //制造一个毒素效果（致死)，每回合造成 基于atk 150%毒素伤害（魔法)
        let poisonEffect = new poison({
            level:new integer(1),
            params:{
                continueTurn:2, //回合数
                deadly:true,//此毒素效果致死
                isMagic:true, //是否魔法攻击（决定计算参数是ATK还是MATK)
                atkRatePerLevel:500,//每提升1级，增加50%伤害
                increase:'linear',//等级提升，atk增长函数
                atkRate:1000,// 基础伤害，100%
                ignoreDEF:0, //非无视防御
            },
            worldContext
        });
        
        //定义作用对象
        let target = new Hero({
            levelCur:1, //number,或者Integer 对象，表示当前等级
            levelMax:4, //number,或者Integer 对象，表示最高等级
            exp:0, // number,表示当前获得的经验值
        },{
            id:1,//英雄id
            name:"stormWarrior",//英雄名称
            raceCampCode:1, //种族&阵营编号
            jobCode:1, //职业编号
            starLevel:1,//number,星数
            rawAttributes:{
                [HeroBaseAttributes.STR]:10,
                [HeroBaseAttributes.AGI]:10,
                [HeroBaseAttributes.VIT]:10,
                [HeroBaseAttributes.INT]:10,
                [HeroBaseAttributes.DEX]:10,
                [HeroBaseAttributes.LUK]:10,
                [HeroOtherAttributes.HP]:20,
                [HeroOtherAttributes.SP]:0,
                [HeroOtherAttributes.SP_MAX]:50,
                [HeroOtherAttributes.CRI_ATK]:0,
                [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
            }
        });
        
        //定义作用源
        let source =  new Hero({
            levelCur:1, //number,或者Integer 对象，表示当前等级
            levelMax:4, //number,或者Integer 对象，表示最高等级
            exp:0, // number,表示当前获得的经验值
        },{
            id:2,//英雄id
            name:"stormWarrior",//英雄名称
            raceCampCode:1, //种族&阵营编号
            jobCode:1, //职业编号
            starLevel:1,//number,星数
            rawAttributes:{
                [HeroBaseAttributes.STR]:10,
                [HeroBaseAttributes.AGI]:10,
                [HeroBaseAttributes.VIT]:10,
                [HeroBaseAttributes.INT]:20,
                [HeroBaseAttributes.DEX]:10,
                [HeroBaseAttributes.LUK]:10,
                [HeroOtherAttributes.HP]:10,
                [HeroOtherAttributes.SP]:0,
                [HeroOtherAttributes.SP_MAX]:50,
                [HeroOtherAttributes.CRI_ATK]:0,
                [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
            }
        });
    
        poisonEffect.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(poisonEffect);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置效果之前，英雄的HP
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(20);
    
        target.installEffect(source,poisonEffect);
    
        expect(poisonEffect.toString()).to.eql("中毒效果(致死):持续[2/2]回合,每回合造成基于150% M_ATK的伤害]");
        //身上有效果
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Poison");
        //放置效果后，英雄的HP 不变
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(20);
        
        
        //模拟经过1个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(poisonEffect.toString()).to.eql("中毒效果(致死):持续[1/2]回合,每回合造成基于150% M_ATK的伤害]");
        //身上有效果
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Poison");
        //英雄的HP 减少
        
        //m_atk=20+1 = 21
        //150%伤害就是31
        //m_def=10+10+1=21
        //实际伤害=31-21=10
        //hp = 20-10 =10
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
        
        //模拟经过2个回合
        worldContext.emit(WordLifeCycle.TURN_END);
        expect(poisonEffect.toString()).to.eql("中毒效果(致死):持续[0/2]回合,每回合造成基于150% M_ATK的伤害]");
        //英雄的HP 减少
    
        //m_atk=20+1 = 21
        //150%伤害就是31
        //m_def=10+10+1=21
        //实际伤害=31-21=10
        
        //hp = 10-10 =0 （致死）
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(0);
    
        //效果消失
        expect(poisonEffect.source).to.eql(undefined);
        expect(poisonEffect.target).to.eql(undefined);
        expect(target.effects.length).to.eql(0);
        
    });
    
});
