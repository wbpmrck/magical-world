/**
 * Created by kaicui on 17/8/5.
 */


const expect = require('chai').expect;
const Attribute = require("./attribute");
const ComputeAttribute = require("./computeAttr");



describe("Compute Attribute", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can calculate by other", function () {
        //first we create some attr
        let str = new Attribute("str","力量",10);
        let agi = new Attribute("agi","敏捷",20);
        
        
        let atk = new ComputeAttribute("atk","攻击力",undefined,[str,agi],([_str,_agi],cb)=>{
            cb(_str.getVal()*50+_agi.getVal()*2);
        });
        
        expect(atk.getVal()).to.eql(540);
    
        atk.updateAdd(60);
        expect(atk.getVal()).to.eql(600);
    
        atk.updateAddPercent(-0.1);
        expect(atk.getVal()).to.eql(540);
    });
    
    it("should overrite raw when deps changed", function () {
        //first we create some attr
        let str = new Attribute("str","力量",10);
        let agi = new Attribute("agi","敏捷",20);
        
        
        let atk = new ComputeAttribute("atk","攻击力",undefined,[str,agi],([_str,_agi],cb)=>{
            cb(_str.getVal()*50+_agi.getVal()*2);
        });
        
        expect(atk.getVal()).to.eql(540);
    
        atk.updateAdd(60);
        expect(atk.getVal()).to.eql(600);
    
        atk.updateAddPercent(-0.1);
        expect(atk.getVal()).to.eql(540);
        
        //dep change!!
        str.updateAdd(90); //add str to 10+90=100  !!
        expect(atk.getVal()).to.eql(5040);
    
    
        var modifier2={addPercent:-0.1};
        agi.modifyAddPercent(modifier2,modifier2.addPercent); //modify agi from 20 to 18
        expect(atk.getVal()).to.eql(5036);
    
        var modifier3={addPercent:0.1};
        atk.modifyAddPercent(modifier3,modifier3.addPercent); //modify atk =5036*1.1
        expect(atk.getVal()).to.eql(5539);
        
    });
    
    it("should can listen change,whenever on update or modify", function () {
    
        //first we create some attr
        let str = new Attribute("str","力量",10);
        let agi = new Attribute("agi","敏捷",20);
    
    
        let atk = new ComputeAttribute("atk","攻击力",undefined,[str,agi],([_str,_agi],cb)=>{
            cb(_str.getVal()*50+_agi.getVal()*2);
        });
    
        expect(atk.getVal()).to.eql(540);
    
        atk.updateAdd(60);
        expect(atk.getVal()).to.eql(600);
    
        atk.updateAddPercent(-0.1);
        expect(atk.getVal()).to.eql(540);
    
        //dep change!!
    
        atk.once("valueChange",(total,raw,modify,val)=>{
            expect(total).to.eql(5040);
        });
    
        
        str.updateAdd(90); //add str to 10+90=100  !!
        expect(atk.getVal()).to.eql(5040);
    
    
    
        atk.once("valueChange",(total,raw,modify,val)=>{
            expect(total).to.eql(5036);
        });
    
        
        var modifier2={addPercent:-0.1};
        agi.modifyAddPercent(modifier2,modifier2.addPercent); //modify agi from 20 to 18
        expect(atk.getVal()).to.eql(5036);
        
    });
    
    
    
});
