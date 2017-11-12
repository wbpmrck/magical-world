/**
 * Created by kaicui on 17/8/5.
 */

const event = require("local-libs").event;
const expect = require('chai').expect;
const reborn = require("./reborn");
const integer = require("../../value/integer");

const {EffectEvents} = require("../effect");
const {WordLifeCycle,CharLifeCycle} = require("../../mechanism/lifeCycle");
const  {Hero,HeroEvents} = require("../../mechanism/role/hero");
const {HeroBaseAttributes,HeroOtherAttributes,HeroDeriveAttributes} = require("../../mechanism/role/attributeRule");

const {make,ref} = require('../../factory/factory'); //对象构造工厂，通过配置可以构造各种对象

describe("reborn :", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("reborn should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        //重生标记，持续3回合，在此期间如果英雄死亡，立刻复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                continueTurn:3, //回合数
                delayTurn:0,//死亡立刻复活
                recoverHpRate:400,//基础恢复40%hp
                recoverHpRatePerLevel:100,//提升1级，多10%
                recoverHpRateIncrease:"linear",//
                
                recoverSpRate:200,//基础恢复20%sp
                recoverSpRatePerLevel:100,//提升1级，多10%
                recoverSpRateIncrease:"linear",//
            },
            worldContext
        });
        
        //定义作用对象
        let target = make({key:"测试hero(hp10,sp10)"});
        
        //定义作用源
        let source = make({key:"测试hero(hp10,sp10)"});
    
        rebornEffect.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(rebornEffect);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置效果
        target.installEffect(source,rebornEffect);
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
    
        expect(rebornEffect.toString()).to.eql("英雄若死亡,[立刻复活],恢复50%HP,恢复30%SP[持续3/3回合]");
        //身上有效果
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Reborn");
        
        
        //模拟扣血
        target.takeMutation({
            from:source,
            mutation:{
                [HeroOtherAttributes.HP]:-10
            },
            remark:{}
        });
    
    
        //身上效果消失
        expect(target.effects.length).to.eql(0);
        //复活之后，50%hp  30%sp
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql( parseInt(target.getAttr(HeroDeriveAttributes.HP_MAX).getVal()*0.5) );
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(parseInt(target.getAttr(HeroOtherAttributes.SP_MAX).getVal()*0.3) );
    
        expect(target.isCompleteDead()).to.eql(false); //没有死
        expect(target.isDead).to.eql(false); //死亡标记
        
    });
    it("reborn should work on dead people", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        //重生标记，持续3回合，在此期间如果英雄死亡，立刻复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                continueTurn:3, //回合数
                delayTurn:0,//死亡立刻复活
                recoverHpRate:400,//基础恢复40%hp
                recoverHpRatePerLevel:100,//提升1级，多10%
                recoverHpRateIncrease:"linear",//
                
                recoverSpRate:200,//基础恢复20%sp
                recoverSpRatePerLevel:100,//提升1级，多10%
                recoverSpRateIncrease:"linear",//
            },
            worldContext
        });
        
        //定义作用对象
        let target = make({key:"测试hero(hp0,sp10)"});
        
        //定义作用源
        let source = make({key:"测试hero(hp10,sp10)"});
    
        rebornEffect.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(rebornEffect);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置效果
        target.installEffect(source,rebornEffect);
    
        expect(rebornEffect.toString()).to.eql("英雄若死亡,[立刻复活],恢复50%HP,恢复30%SP[持续3/3回合]");
    
        //身上效果消失
        expect(target.effects.length).to.eql(0);
        //复活之后，50%hp  30%sp
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql( parseInt(target.getAttr(HeroDeriveAttributes.HP_MAX).getVal()*0.5) );
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(parseInt(target.getAttr(HeroOtherAttributes.SP_MAX).getVal()*0.3) );
    
        expect(target.isCompleteDead()).to.eql(false); //没有死
        expect(target.isDead).to.eql(false); //死亡标记
        
        
        //模拟扣血,此时已经无重生效果
        target.takeMutation({
            from:source,
            mutation:{
                [HeroOtherAttributes.HP]:-25
            },
            remark:{}
        });
    
    
        //身上效果消失
        expect(target.effects.length).to.eql(0);
        //复活之后，50%hp  30%sp
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql( 0 );
        expect(target.isCompleteDead()).to.eql(true); //死了
        expect(target.isDead).to.eql(true); //死亡标记
        
    });
    
    it("reborn effect can delay", function () {
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
    
        //重生标记，持续3回合，在此期间如果英雄死亡，在下一回合开始的时候才复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                continueTurn:3, //回合数
                delayTurn:1,//死亡后，在下一回合开始的时候才复活
                recoverHpRate:400,//基础恢复40%hp
                recoverHpRatePerLevel:100,//提升1级，多10%
                recoverHpRateIncrease:"linear",//
            
                recoverSpRate:200,//基础恢复20%sp
                recoverSpRatePerLevel:100,//提升1级，多10%
                recoverSpRateIncrease:"linear",//
            },
            worldContext
        });
    
        //定义作用对象
        let target = make({key:"测试hero(hp10,sp10)"});
    
        //定义作用源
        let source =  make({key:"测试hero(hp10,sp10)"});
    
        rebornEffect.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(rebornEffect);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置效果
        target.installEffect(source,rebornEffect);
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
    
        expect(rebornEffect.toString()).to.eql("英雄若死亡,[下回合开始时复活],恢复50%HP,恢复30%SP[持续3/3回合]");
        //身上有效果
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Reborn");
    
    
        //模拟扣血
        target.takeMutation({
            from:source,
            mutation:{
                [HeroOtherAttributes.HP]:-10
            },
            remark:{}
        });
    
    
        //此时身上有效果（还没有发动）
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Reborn");
        //此时属性还是死亡状态
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(0);
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(0);
        expect(target.isCompleteDead()).to.eql(false); //返回并没有死透
        expect(target.isDead).to.eql(true); //死亡标记
    
    
        //模拟第一回合结束，下回合开始
        worldContext.emit(WordLifeCycle.TURN_END,1);
        worldContext.emit(WordLifeCycle.TURN_BEGIN,2);
        
        //此时应该触发重生、身上效果消失
        expect(target.effects.length).to.eql(0);
        //复活之后，50%hp  30%sp
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql( parseInt(target.getAttr(HeroDeriveAttributes.HP_MAX).getVal()*0.5) );
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(parseInt(target.getAttr(HeroOtherAttributes.SP_MAX).getVal()*0.3) );
    
        expect(target.isCompleteDead()).to.eql(false); //返回并没有死透
        expect(target.isDead).to.eql(false); //死亡标记
    });
    
    it("reborn effect will expire if turn timeout", function () {
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
    
        //重生标记，持续3回合，在此期间如果英雄死亡，在下一回合开始的时候才复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                continueTurn:3, //回合数
                delayTurn:1,//死亡后，在下一回合开始的时候才复活
                recoverHpRate:400,//基础恢复40%hp
                recoverHpRatePerLevel:100,//提升1级，多10%
                recoverHpRateIncrease:"linear",//
            
                recoverSpRate:200,//基础恢复20%sp
                recoverSpRatePerLevel:100,//提升1级，多10%
                recoverSpRateIncrease:"linear",//
            },
            worldContext
        });
    
        //定义作用对象
        let target = make({key:"测试hero(hp10,sp10)"});
        //定义作用源
        let source =  make({key:"测试hero(hp10,sp10)"});
    
        rebornEffect.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(rebornEffect);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置效果
        target.installEffect(source,rebornEffect);
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
        expect(rebornEffect.toString()).to.eql("英雄若死亡,[下回合开始时复活],恢复50%HP,恢复30%SP[持续3/3回合]");
        //身上有效果
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Reborn");
    
        
        //模拟先经过3个回合
        worldContext.emit(WordLifeCycle.TURN_BEGIN,1);
        worldContext.emit(WordLifeCycle.TURN_END,1);
        //身上有效果
        expect(rebornEffect.toString()).to.eql("英雄若死亡,[下回合开始时复活],恢复50%HP,恢复30%SP[持续2/3回合]");
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Reborn");
        
        worldContext.emit(WordLifeCycle.TURN_BEGIN,2);
        worldContext.emit(WordLifeCycle.TURN_END,2);
        //身上有效果
        expect(rebornEffect.toString()).to.eql("英雄若死亡,[下回合开始时复活],恢复50%HP,恢复30%SP[持续1/3回合]");
        expect(target.effects.length).to.eql(1);
        expect(target.effects[0].name).to.eql("Reborn");
        
        worldContext.emit(WordLifeCycle.TURN_BEGIN,3);
        worldContext.emit(WordLifeCycle.TURN_END,3);
        
        //此时身上效果消失
        expect(rebornEffect.toString()).to.eql("英雄若死亡,[下回合开始时复活],恢复50%HP,恢复30%SP[持续0/3回合]");
        expect(target.effects.length).to.eql(0);
    
        //模拟扣血
        target.takeMutation({
            from:source,
            mutation:{
                [HeroOtherAttributes.HP]:-10
            },
            remark:{}
        });
        
        //此时属性还是死亡状态，无法复活
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(0);
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(0);
        expect(target.isCompleteDead()).to.eql(true); //死透
        expect(target.isDead).to.eql(true); //死亡标记
    
    
    });
    
    it("multiple reborn effect can work together,one by one", function () {
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
    
        //重生标记，持续3回合，在此期间如果英雄死亡，立刻复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                continueTurn:3, //回合数
                delayTurn:0,//死亡立刻复活
                recoverHpRate:400,//基础恢复40%hp
                recoverHpRatePerLevel:100,//提升1级，多10%
                recoverHpRateIncrease:"linear",//
            
                recoverSpRate:200,//基础恢复20%sp
                recoverSpRatePerLevel:100,//提升1级，多10%
                recoverSpRateIncrease:"linear",//
            },
            worldContext
        });
        //重生标记，持续3回合，在此期间如果英雄死亡，立刻复活。并恢复50%hp,30%sp
        let rebornEffect2 = new reborn({
            level:new integer(1),
            params:{
                continueTurn:3, //回合数
                delayTurn:0,//死亡立刻复活
                recoverHpRate:400,//基础恢复40%hp
                recoverHpRatePerLevel:100,//提升1级，多10%
                recoverHpRateIncrease:"linear",//
            
                recoverSpRate:200,//基础恢复20%sp
                recoverSpRatePerLevel:100,//提升1级，多10%
                recoverSpRateIncrease:"linear",//
            },
            worldContext
        });
    
        //定义作用对象
        let target = make({key:"测试hero(hp10,sp10)"});
    
        //定义作用源
        let source = make({key:"测试hero(hp10,sp10)"});
    
        rebornEffect.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(rebornEffect);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
    
        //放置2个重生效果
        target.installEffect(source,rebornEffect);
        target.installEffect(source,rebornEffect2);
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
    
        expect(rebornEffect.toString()).to.eql("英雄若死亡,[立刻复活],恢复50%HP,恢复30%SP[持续3/3回合]");
        expect(rebornEffect2.toString()).to.eql("英雄若死亡,[立刻复活],恢复50%HP,恢复30%SP[持续3/3回合]");
        //身上有效果
        expect(target.effects.length).to.eql(2);
        expect(target.effects[0].name).to.eql("Reborn");
        expect(target.effects[1].name).to.eql("Reborn");
    
        //校验会触发重生事件
        let reborn_count=0;
        target.once(HeroEvents.BEFORE_HERO_REBORN,()=>{
            reborn_count++;
            expect(reborn_count).to.eql(1);
        });
    
        //模拟扣血
        target.takeMutation({
            from:source,
            mutation:{
                [HeroOtherAttributes.HP]:-10
            },
            remark:{}
        });
    
    
    
        //身上效果1消失
        expect(target.effects.length).to.eql(1);
        //剩下的效果是效果2
        expect(target.effects[0]).to.eql(rebornEffect2);
        //复活之后，50%hp  30%sp
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql( parseInt(target.getAttr(HeroDeriveAttributes.HP_MAX).getVal()*0.5) );
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(parseInt(target.getAttr(HeroOtherAttributes.SP_MAX).getVal()*0.3) );
    
        expect(target.isCompleteDead()).to.eql(false); //没有死
        expect(target.isDead).to.eql(false); //死亡标记
    
    
    
    
        target.once(HeroEvents.BEFORE_HERO_REBORN,()=>{
            reborn_count++;
            expect(reborn_count).to.eql(2);
        });
        //再扣血，再死一次
        target.takeMutation({
            from:source,
            mutation:{
                [HeroOtherAttributes.HP]:0- target.getAttr(HeroDeriveAttributes.HP_MAX).getVal()
            },
            remark:{}
        });
    
        //身上效果2消失
        expect(target.effects.length).to.eql(0);
        //复活之后，50%hp  30%sp
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql( parseInt(target.getAttr(HeroDeriveAttributes.HP_MAX).getVal()*0.5) );
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(parseInt(target.getAttr(HeroOtherAttributes.SP_MAX).getVal()*0.3) );
    
        expect(target.isCompleteDead()).to.eql(false); //没有死
        expect(target.isDead).to.eql(false); //死亡标记
    
    });
});
