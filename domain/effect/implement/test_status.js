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


describe("statusEffect :", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should work", function () {
    
        let worldContext ={};//模拟世界上下文
        event.mixin(worldContext);
        
        let frozenEffect = new status({
            level:new integer(1),
            params:{
                status:statusEnum.Frozen, //状态：冰冻
                baseTurn:2, //基础回合数
                levelFactor:20, //  等级/levelFactor + baseTurn = 实际生效回合数
                stopAction:true,
                stopSkill:true,
            },
            worldContext
        });
        
        //定义一个模拟的作用对象
        let target = {
           
        };
        let source = {};//假的作用源
    
        frozenEffect.once(EffectEvents.INSTALLED,(ef)=>{
            expect(ef).to.eql(frozenEffect);
            expect(ef.source).to.eql(source);
            expect(ef.target).to.eql(target);
        });
    
        frozenEffect.onInstall(source,target);
    
    
        expect(frozenEffect.toString()).to.eql("效果:[Frozen,stopAction,stopSkill]持续[2/2]回合");
        
        
        //模拟经过一个回合
        worldContext.emit(WordLifeCycle.TURN_END);
      
        
        //然后给effect进行升级
        let levelModifier ={addVal:new integer(18)};
        frozenEffect.level.addModifier(levelModifier,levelModifier); //升了1级
        expect(frozenEffect.toString()).to.eql("效果:[Frozen,stopAction,stopSkill]持续[1/2]回合");
        
        //然后给effect进行再次升级
        levelModifier.addVal.addModifier({},{addVal:1}); //又升了1级
        expect(frozenEffect.toString()).to.eql("效果:[Frozen,stopAction,stopSkill]持续[2/3]回合");
    
    
        frozenEffect.once(EffectEvents.UNINSTALLED,(ef)=>{
            expect(ef).to.eql(frozenEffect);
            expect(ef.source).to.eql(undefined);
            expect(ef.target).to.eql(undefined);
        });
    
        //然后移除效果
        frozenEffect.onUninstall();
    });
    
});
