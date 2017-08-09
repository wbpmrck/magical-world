/**
 * Created by kaicui on 17/8/5.
 */


const expect = require('chai').expect;
const Attribute = require("./attribute");



describe("Attribute", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can update", function () {
        let str = new Attribute("str","力量",10); //init a val,raw = 10
        
        expect(str.getVal()).to.eql(10);
        
        str.updateAdd(5);
        expect(str.getVal()).to.eql(15);
        
        str.updateAddPercent(-0.3);
        expect(str.getVal()).to.eql(10);
    });
    
    it("should can modify", function () {
    
        let str = new Attribute("str","力量",10); //init a val,raw = 10
    
        expect(str.getVal()).to.eql(10);
    
        var modifier1={addVal:5};
        str.modifyAdd(modifier1,modifier1.addVal);
        expect(str.getVal()).to.eql(15);
    
        var modifier2={addPercent:-0.1};
        str.modifyAddPercent(modifier2,modifier2.addPercent);
        expect(str.getVal()).to.eql(14);
        
        str.removeModifier(modifier2);
        expect(str.getVal()).to.eql(15);

    });
    it("should can listen change,whenever on update or modify", function () {
    
    
        let str = new Attribute("str","力量",10); //init a val,raw = 10
        expect(str.getVal()).to.eql(10);
        
        str.once("valueChange",(total,raw,modify,val)=>{
            expect(total).to.eql(15);
            expect(raw).to.eql(15);
            expect(str.getVal()).to.eql(15);
        });
    
        str.updateAdd(5);
        expect(str.getVal()).to.eql(15);
    

        str.once("valueChange",(total,raw,modify,val)=>{
            expect(total).to.eql(12);
            expect(raw).to.eql(15);
            expect(str.getVal()).to.eql(12);
        });
    
        var modifier={addPercent:-0.2};
        str.modifyAddPercent(modifier,modifier.addPercent);
        expect(str.getVal()).to.eql(12);
    
    
        str.once("valueChange",(total,raw,modify,val)=>{
            expect(total).to.eql(15);
            expect(raw).to.eql(15);
            expect(str.getVal()).to.eql(15);
        });
    
        str.removeModifier(modifier);
        expect(str.getVal()).to.eql(15);
        
    });
    
    
});
