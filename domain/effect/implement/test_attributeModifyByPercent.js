/**
 * Created by kaicui on 17/8/5.
 */


const expect = require('chai').expect;
const attributeModifyByPercent = require("./attributeModifyByPercent");
const integer = require("../../value/integer");

const event = require("local-libs").event;
const Attribute = require("../../attribute/attribute");



describe("attributeModifyByPercent :", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should increase work", function () {
        //定义了一个修改属性的效果：初始10，等级因子是10，当前等级是1，增长曲线是线性
        let effect = new attributeModifyByPercent({
            name:"attributeModifyByPercent",
            desc:"修正属性(千分比)",
            level:new integer(1),
            params:{
                attrName:"str",
                mode:"inc",
                basePercent:10, //基础增加 10 / 1000 = 1/100
                levelFactor:10,
                increase:"linear"
            }
        });
        
        //定义一个模拟的作用对象
        let target = {
            attr:{
                str:new Attribute("str","力量",100),
                agi:new Attribute("agi","敏捷",100)
            },
            getAttr:function (name) {
                return this.attr[name];
            }
        };
        event.mixin(target);
        let source = {};//假的作用源
        effect.onInstall(source,target);
        
        //此时str = 100+ 100*(0.01 + 1*0.01) = 102
        expect(target.attr.str.getVal()).to.eql(102);
        expect(effect.toString()).to.eql("力量增加2%");
        
        //然后给effect进行升级
        let levelModifier ={addVal:new integer(1)};
        effect.level.addModifier(levelModifier,levelModifier); //升了1级
        //此时str = 100+ 100*(0.01 + 2*0.01) = 103
        expect(target.attr.str.getVal()).to.eql(103);
        expect(effect.toString()).to.eql("力量增加3%");
        
        //然后给effect进行再次升级
        levelModifier.addVal.addModifier({},{addVal:1}); //又升了1级
        //此时str = 100+ 100*(0.01 + 3*0.01) = 104
        expect(target.attr.str.getVal()).to.eql(104);
        expect(effect.toString()).to.eql("力量增加4%");
    });
    
    it("should decrease work", function () {
        //定义了一个修改属性的效果：初始10，等级因子是10，当前等级是1，增长曲线是线性
        let effect = new attributeModifyByPercent({
            name:"attributeModifyByPercent",
            desc:"修正属性(千分比)",
            level:new integer(1),
            params:{
                attrName:"str",
                mode:"dec",
                basePercent:10, //基础减少 10 / 1000 = 1/100
                levelFactor:10,
                increase:"linear"
            }
        });
    
        //定义一个模拟的作用对象
        let target = {
            attr:{
                str:new Attribute("str","力量",100),
                agi:new Attribute("agi","敏捷",100)
            },
            getAttr:function (name) {
                return this.attr[name];
            }
        };
        event.mixin(target);
        let source = {};//假的作用源
        effect.onInstall(source,target);
    
        //此时str = 100- 100*(0.01 + 1*0.01) = 98
        expect(target.attr.str.getVal()).to.eql(98);
        expect(effect.toString()).to.eql("力量减少2%");
    
        //然后给effect进行升级
        let levelModifier ={addVal:new integer(1)};
        effect.level.addModifier(levelModifier,levelModifier); //升了1级
        //此时str = 100- 100*(0.01 + 2*0.01) = 97
        expect(target.attr.str.getVal()).to.eql(97);
        expect(effect.toString()).to.eql("力量减少3%");
    
        //然后给effect进行再次升级
        levelModifier.addVal.addModifier({},{addVal:1}); //又升了1级
        //此时str = 100- 100*(0.01 + 3*0.01) = 96
        expect(target.attr.str.getVal()).to.eql(96);
        expect(effect.toString()).to.eql("力量减少4%");
    });
    
});
