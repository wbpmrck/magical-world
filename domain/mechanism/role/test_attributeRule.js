/**
 * Created by kaicui on 17/8/5.
 */


const oop = require("local-libs").oop;
const expect = require('chai').expect;
const Attribute = require("../../attribute/attribute");
const AttrCarrier = require("../../attribute/attrCarrier");
const ComputeAttribute = require("../../attribute/computeAttr");
const attributeRule = require("./attributeRule");


describe("attributeRule", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can work", function () {
        let jack = new AttrCarrier();
        jack.levelCur = new Attribute("levelCur","当前等级",10);
        let rawAttributes={
          STR:10,
          AGI:20,
          VIT:30,
          INT:40,
          DEX:50,
          LUK:60
        };
        attributeRule.injectHeroAttributes(jack,rawAttributes);
      
        expect(jack.getAttr("STR").getVal()).to.eql(10);
        expect(jack.getAttr("AGI").getVal()).to.eql(20);
        expect(jack.getAttr("VIT").getVal()).to.eql(30);
        expect(jack.getAttr("INT").getVal()).to.eql(40);
        expect(jack.getAttr("DEX").getVal()).to.eql(50);
        expect(jack.getAttr("LUK").getVal()).to.eql(60);
        expect(jack.levelCur.getVal()).to.eql(10);
    
    
        expect(jack.getAttr("ATK").getVal()).to.gt(0);
        expect(jack.getAttr("HP_MAX").getVal()).to.gt(0);
        expect(jack.getAttr("M_ATK").getVal()).to.gt(0);
        expect(jack.getAttr("DEF").getVal()).to.gt(0);
        expect(jack.getAttr("M_DEF").getVal()).to.gt(0);
        expect(jack.getAttr("SPD").getVal()).to.gt(0);
        expect(jack.getAttr("FLEE").getVal()).to.gt(0);
        expect(jack.getAttr("HIT").getVal()).to.gt(0);
        expect(jack.getAttr("CRI").getVal()).to.gt(0);
        
    });
    
  
    
});
