/**
 * Created by kaicui on 17/8/5.
 */


const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {EffectAndAttrCarrier,EffectAndAttrCarrierLifeEvent} = require("./effectAndAttrCarrier");
const AttributeModify = require("../effect/implement/attributeModify");
const Attribute = require("../attribute/attribute");
const {Effect,EffectEvents} = require("./effect");

const Integer = require("../value/integer");



describe("EffectAndAttrCarrier ", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should work", function () {
        let Warrior = oop.defineClass({
            super:EffectAndAttrCarrier,
            constructor:function(){
                var self = this;
            },
            prototype:{
            }
        });
        
        //create a warrior
        let w1 =new Warrior();
        expect(w1.effects.length).to.eql(0);
        
        //prepare install
        let _source ={};
        w1.addAttr(new Attribute("str","力量",10));
        expect(w1.getAttr("str").getVal()).to.eql(10);
        
    
        //定义了一个修改属性的效果：初始20，等级因子是10，当前等级是1，增长曲线是线性
        let _effect = new AttributeModify({
            name:"attributeModify",
            desc:"修正属性",
            level:new Integer(1),
            params:{
                attrName:"str",
                mode:"inc",
                basePoint:20,
                levelFactor:10,
                increase:"linear"
            }
        });
        
        //these are events emit by effectCarrier
        w1.once(EffectAndAttrCarrierLifeEvent.BEFORE_INSTALL_EFFECT,(context,source,effect)=>{
            expect(source).to.eql(_source);
            expect(effect).to.eql(_effect);
            expect(w1.getAttr("str").getVal()).to.eql(10); //before install,value not change
        });
        w1.once(EffectAndAttrCarrierLifeEvent.AFTER_INSTALL_EFFECT,(context,source,effect)=>{
            expect(source).to.eql(_source);
            expect(effect).to.eql(_effect);
            expect(w1.getAttr("str").getVal()).to.eql(40); //after install,value changed
        });
        
        //this is event emit by effect object
        _effect.once(EffectEvents.INSTALLED,()=>{
            expect(_effect.target).to.eql(w1);
            expect(w1.getAttr("str").getVal()).to.eql(40); //after install,value changed
        });
        w1.installEffect(_source,_effect);
        expect(w1.getAttr("str").getVal()).to.eql(40);
        expect(w1.effects.length).to.eql(1);
        //prepare to uninstall
    
        //these are events emit by effectCarrier
        w1.once(EffectAndAttrCarrierLifeEvent.BEFORE_UNINSTALL_EFFECT,(effect)=>{
            expect(effect).to.eql(_effect);
            expect(w1.getAttr("str").getVal()).to.eql(40); //before uninstall,value not change
        });
        w1.once(EffectAndAttrCarrierLifeEvent.AFTER_UNINSTALL_EFFECT,(effect)=>{
            expect(effect).to.eql(_effect);
            expect(w1.getAttr("str").getVal()).to.eql(10); //after uninstall,value back to origin
        });
    
        //this is event emit by effect object
        _effect.once(EffectEvents.UNINSTALLED,()=>{
            expect(_effect.target).to.eql(undefined);
            expect(w1.getAttr("str").getVal()).to.eql(10); //after uninstall,value back to origin
        });
        w1.uninstallEffect(_effect);
    
        expect(w1.effects.length).to.eql(0);
    
    });
    
    it("should can cancel install process", function () {
        let Warrior = oop.defineClass({
            super:EffectAndAttrCarrier,
            constructor:function(){
                var self = this;
            },
            prototype:{
            }
        });
    
        //create a warrior
        let w1 =new Warrior();
        expect(w1.effects.length).to.eql(0);
    
        //prepare install
        let _source ={};
        w1.addAttr(new Attribute("str","力量",10));
        expect(w1.getAttr("str").getVal()).to.eql(10);
    
    
        //定义了一个修改属性的效果：初始20，等级因子是10，当前等级是1，增长曲线是线性
        let _effect = new AttributeModify({
            name:"attributeModify",
            desc:"修正属性",
            level:new Integer(1),
            params:{
                attrName:"str",
                mode:"inc",
                basePoint:20,
                levelFactor:10,
                increase:"linear"
            }
        });
        //add canceler to carrier
        //these are events emit by effectCarrier
        w1.once(EffectAndAttrCarrierLifeEvent.BEFORE_INSTALL_EFFECT,(context,source,effect)=>{
            context.cancel = true;
        });
    
        //these are events emit by effectCarrier
        w1.once(EffectAndAttrCarrierLifeEvent.BEFORE_INSTALL_EFFECT,(context,source,effect)=>{
            expect(source).to.eql(_source);
            expect(effect).to.eql(_effect);
            expect(w1.getAttr("str").getVal()).to.eql(10); //before install,value not change
        });
        w1.once(EffectAndAttrCarrierLifeEvent.AFTER_INSTALL_EFFECT,(context,source,effect)=>{
           
            throw new Error("this should not be called!");
        });
    
        //this is event emit by effect object
        _effect.once(EffectEvents.INSTALLED,()=>{
            throw new Error("this should not be called!");
        });
        w1.installEffect(_source,_effect);
        expect(w1.getAttr("str").getVal()).to.eql(10);
        expect(w1.effects.length).to.eql(0);
    });
    
});
