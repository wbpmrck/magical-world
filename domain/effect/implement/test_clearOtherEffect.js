/**
 * Created by kaicui on 17/8/5.
 */

const event = require("local-libs").event;
const expect = require('chai').expect;
const clearOtherEffect = require("./clearOtherEffect");
const effectCategoryEnum = require("../effectCategoryEnum");
const reborn = require("./reborn");
const integer = require("../../value/integer");

const {EffectEvents} = require("../effect");
const {WordLifeCycle,CharLifeCycle} = require("../../mechanism/lifeCycle");
const  {Hero,HeroEvents} = require("../../mechanism/role/hero");
const {HeroBaseAttributes,HeroOtherAttributes,HeroDeriveAttributes} = require("../../mechanism/role/attributeRule");

const {make,ref} = require('../../factory/factory'); //对象构造工厂，通过配置可以构造各种对象

describe("clearOtherEffect :", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("[clearable] should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        //清除效果，待会会被用来清除下面的"重生效果"
        //没设置任何参数，表示"所有可清除的效果都会被清除"
        let clearEffect = new clearOtherEffect({
            level:new integer(1),
            params:{
                minLevelToClear:undefined,
                maxLevelToClear:undefined,
                categoryToClear:undefined,
                nameToClear:undefined
            },
            worldContext
        });
        
        //重生效果，待会会被用来清除
        //重生标记，持续3回合，在此期间如果英雄死亡，立刻复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                clearable:true,//可被清除
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
        
        //这个重生效果不可被清除
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
    
    
        //放置效果
        target.installEffect(source,rebornEffect);
        //放置效果2
        target.installEffect(source,rebornEffect2);
        
        //身上有效果
        expect(target.effects.length).to.eql(2);
        expect(target.effects[0].name).to.eql("Reborn");
        expect(target.effects[1].name).to.eql("Reborn");
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
    
    
        //放置 清除效果
        target.installEffect(source,clearEffect);
        
        
    
        //身上效果消失1个
        expect(target.effects.length).to.eql(1);
        //只剩下effect2
        expect(target.effects[0]).to.eql(rebornEffect2);
    
    
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
    it("[minLevelToClear] should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        //清除效果，待会会被用来清除下面的"重生效果"
        //minLevelToClear=2 所以只会清除 第二个
        let clearEffect = new clearOtherEffect({
            level:new integer(1),
            params:{
                minLevelToClear:2,
                maxLevelToClear:undefined,
                categoryToClear:undefined,
                nameToClear:undefined
            },
            worldContext
        });
        
        //重生效果，待会会被用来清除
        //重生标记，持续3回合，在此期间如果英雄死亡，立刻复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                clearable:true,//可被清除
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
        
        let rebornEffect2 = new reborn({
            level:new integer(2),
            params:{
                clearable:true,//可被清除
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
        //放置效果2
        target.installEffect(source,rebornEffect2);
        
        //身上有效果
        expect(target.effects.length).to.eql(2);
        expect(target.effects[0].name).to.eql("Reborn");
        expect(target.effects[1].name).to.eql("Reborn");
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
    
    
        //放置 清除效果
        target.installEffect(source,clearEffect);
        
        
    
        //身上效果消失1个
        expect(target.effects.length).to.eql(1);
        //只剩下effect2
        expect(target.effects[0]).to.eql(rebornEffect);
    
    
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
    it("[maxLevelToClear] should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        //清除效果，待会会被用来清除下面的"重生效果"
        //maxLevelToClear=2 所以只会清除 第1个
        let clearEffect = new clearOtherEffect({
            level:new integer(1),
            params:{
                minLevelToClear:undefined,
                maxLevelToClear:1,
                categoryToClear:undefined,
                nameToClear:undefined
            },
            worldContext
        });
        
        //重生效果，待会会被用来清除
        //重生标记，持续3回合，在此期间如果英雄死亡，立刻复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                clearable:true,//可被清除
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
        
        let rebornEffect2 = new reborn({
            level:new integer(2),
            params:{
                clearable:true,//可被清除
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
        //放置效果2
        target.installEffect(source,rebornEffect2);
        
        //身上有效果
        expect(target.effects.length).to.eql(2);
        expect(target.effects[0].name).to.eql("Reborn");
        expect(target.effects[1].name).to.eql("Reborn");
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
    
    
        //放置 清除效果
        target.installEffect(source,clearEffect);
        
        
    
        //身上效果消失1个
        expect(target.effects.length).to.eql(1);
        //只剩下effect2
        expect(target.effects[0]).to.eql(rebornEffect2);
    
    
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
        //复活之后，60%hp  40%sp
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql( parseInt(target.getAttr(HeroDeriveAttributes.HP_MAX).getVal()*0.6) );
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(parseInt(target.getAttr(HeroOtherAttributes.SP_MAX).getVal()*0.4) );
    
        expect(target.isCompleteDead()).to.eql(false); //没有死
        expect(target.isDead).to.eql(false); //死亡标记
        
    });
    it("[categoryToClear] should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        //清除效果，待会会被用来清除下面的"重生效果"
        //只移除effectCategoryEnum=NEGATIVE 的
        let clearEffect = new clearOtherEffect({
            level:new integer(1),
            params:{
                minLevelToClear:undefined,
                maxLevelToClear:undefined,
                categoryToClear:effectCategoryEnum.NEGATIVE, //移除负面效果
                nameToClear:undefined
            },
            worldContext
        });
        
        //重生效果，待会会被用来清除
        //重生标记，持续3回合，在此期间如果英雄死亡，立刻复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                clearable:true,//可被清除
                category:effectCategoryEnum.NEGATIVE,
                
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
        
        let rebornEffect2 = new reborn({
            level:new integer(2),
            params:{
                clearable:true,//可被清除
                category:effectCategoryEnum.POSITIVE,
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
        //放置效果2
        target.installEffect(source,rebornEffect2);
        
        //身上有效果
        expect(target.effects.length).to.eql(2);
        expect(target.effects[0].name).to.eql("Reborn");
        expect(target.effects[1].name).to.eql("Reborn");
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
    
    
        //放置 清除效果
        target.installEffect(source,clearEffect);
        
        
    
        //身上效果消失1个
        expect(target.effects.length).to.eql(1);
        //只剩下effect2
        expect(target.effects[0]).to.eql(rebornEffect2);
    
    
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
        //复活之后，60%hp  40%sp
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql( parseInt(target.getAttr(HeroDeriveAttributes.HP_MAX).getVal()*0.6) );
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(parseInt(target.getAttr(HeroOtherAttributes.SP_MAX).getVal()*0.4) );
    
        expect(target.isCompleteDead()).to.eql(false); //没有死
        expect(target.isDead).to.eql(false); //死亡标记
        
    });it("[nameToClear] should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        //清除效果，待会会被用来清除下面的"重生效果"
        //只移除effectCategoryEnum=NEGATIVE 的
        let clearEffect = new clearOtherEffect({
            level:new integer(1),
            params:{
                minLevelToClear:undefined,
                maxLevelToClear:undefined,
                categoryToClear:undefined, //移除负面效果
                nameToClear:"reborn"
            },
            worldContext
        });
        
        //重生效果，待会会被用来清除
        //重生标记，持续3回合，在此期间如果英雄死亡，立刻复活。并恢复50%hp,30%sp
        let rebornEffect = new reborn({
            level:new integer(1),
            params:{
                clearable:true,//可被清除
                category:effectCategoryEnum.NEGATIVE,
                
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
        
        let rebornEffect2 = new reborn({
            level:new integer(2),
            params:{
                clearable:true,//可被清除
                category:effectCategoryEnum.POSITIVE,
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
        //放置效果2
        target.installEffect(source,rebornEffect2);
        
        //身上有效果
        expect(target.effects.length).to.eql(2);
        expect(target.effects[0].name).to.eql("Reborn");
        expect(target.effects[1].name).to.eql("Reborn");
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(10);
    
    
        //放置 清除效果
        target.installEffect(source,clearEffect);
        
        
    
        //身上效果消失
        expect(target.effects.length).to.eql(0);
    
    
        //模拟扣血
        target.takeMutation({
            from:source,
            mutation:{
                [HeroOtherAttributes.HP]:-10
            },
            remark:{}
        });
    
    
        //复活之后，60%hp  40%sp
        expect(target.getAttr(HeroOtherAttributes.HP).getVal()).to.eql(0);
        expect(target.getAttr(HeroOtherAttributes.SP).getVal()).to.eql(0);
    
        expect(target.isCompleteDead()).to.eql(true); //死
        expect(target.isDead).to.eql(true); //死亡标记
        
    });
});
