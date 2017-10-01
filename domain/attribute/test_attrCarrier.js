/**
 * Created by kaicui on 17/8/5.
 */


const oop = require("local-libs").oop;
const expect = require('chai').expect;
const Attribute = require("./attribute");
const AttrCarrier = require("./attrCarrier");
const ComputeAttribute = require("./computeAttr");


describe("AttrCarrier", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can work", function () {
        let jack = new AttrCarrier();
        expect(jack.hasAttr("str")).to.eql(false);
        
        let str = new Attribute("str","力量",10); //init a val,raw = 10
    
    
        jack.addAttr(str);
        expect(jack.getAttr("str")).to.eql(str);
        expect(jack.getAttr("str").getVal()).to.eql(10);
        expect(jack.hasAttr("str")).to.eql(true);
        
    
        let agi = new Attribute("agi","敏捷",10); //init a val,raw = 10
    
        jack.addAttr(agi);
        expect(jack.getAttr("agi")).to.eql(agi);
        
        jack.once("attrChange",(attr,total,raw,modify,val)=>{
            expect(attr).to.eql(agi);
            expect(total).to.eql(20);
            expect(raw).to.eql(20);
            expect(modify).to.eql(0);
        });
        agi.updateAdd(10);//add 10 to agi
        
        jack.once("attrChange",(attr,total,raw,modify,val)=>{
            expect(attr).to.eql(agi);
            expect(total).to.eql(30);
            expect(raw).to.eql(20);
            expect(modify).to.eql(10);
        });
        agi.modifyAdd({},10);//modify add 10 to agi
    
    
        let atk = new ComputeAttribute("atk","攻击力",undefined,[str,agi],([_str,_agi],cb)=>{
            cb(_str.getVal()*50+_agi.getVal()*2);
        });
    
        jack.addAttr(atk);
        expect(jack.getAttr("atk")).to.eql(atk);
        expect(jack.getAttr("atk").getVal()).to.eql(560);
        expect(jack.hasAttr("atk")).to.eql(true);
        
        
        var exported = jack.exportAttributesRaw();
    
        expect(exported['str']).to.eql(10);
        expect(exported['agi']).to.eql(20);
        expect(exported['atk']).to.eql(undefined);
        
        
        jack.removeAttr("str");
        expect(jack.hasAttr("str")).to.eql(false);
    
    });
    
    
    it("should can work on subclass", function () {
        
        let Warrior = oop.defineClass({
            super:AttrCarrier,
            constructor:function(){
                var self = this;
                
            },
            prototype:{
            
            }
        });
        
        let jack = new Warrior();
        expect(jack.hasAttr("str")).to.eql(false);
        
        let str = new Attribute("str","力量",10); //init a val,raw = 10
    
        jack.addAttr(str);
        expect(jack.getAttr("str")).to.eql(str);
        expect(jack.getAttr("str").getVal()).to.eql(10);
        expect(jack.hasAttr("str")).to.eql(true);
        
        jack.removeAttr("str");
        expect(jack.hasAttr("str")).to.eql(false);
    
    
        let agi = new Attribute("agi","敏捷",10); //init a val,raw = 10
    
        jack.addAttr(agi);
        expect(jack.getAttr("agi")).to.eql(agi);
    
        jack.once("attrChange",(attr,total,raw,modify,val)=>{
            expect(attr).to.eql(agi);
            expect(total).to.eql(20);
            expect(raw).to.eql(20);
            expect(modify).to.eql(0);
        });
        agi.updateAdd(10);//add 10 to agi
    
        jack.once("attrChange",(attr,total,raw,modify,val)=>{
            expect(attr).to.eql(agi);
            expect(total).to.eql(30);
            expect(raw).to.eql(20);
            expect(modify).to.eql(10);
        });
        agi.modifyAdd({},10);//modify add 10 to agi
        
    });
    
    
    
});
