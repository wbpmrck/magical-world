/**
 * Created by kaicui on 17/8/5.
 */


const expect = require('chai').expect;
const attributeReset = require("./attributeReset");
const integer = require("../../value/integer");

const event = require("local-libs").event;
const Attribute = require("../../attribute/attribute");



describe("attributeReset :", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should increase work", function () {
        //定义了一个修改属性的效果：初始20，等级因子是10，当前等级是1，增长曲线是线性
        let effect = new attributeReset({
            name:"attributeReset",
            desc:"修改属性",
            level:new integer(1),
            params:{
                attrName:"str",
                mode:"inc",
                basePoint:20,
                levelFactor:10,
                increase:"linear"
            }
        });
        
        //定义一个模拟的作用对象
        let target = {
            attr:{
                str:new Attribute("str","力量",10),
                agi:new Attribute("agi","敏捷",10)
            },
            getAttr:function (name) {
                return this.attr[name];
            }
        };
        event.mixin(target);
        let source = {};//假的作用源
        effect.onInstall(source,target);
        
        //此时str = 10+ (20 + 1*10) = 40
        expect(target.attr.str.getVal()).to.eql(40);
        expect(effect.toString()).to.eql("力量增加30");
        
        //然后给effect进行升级(对于reset效果，不是附着在对象上面，所以应该不变)
        let levelModifier ={addVal:new integer(1)};
        effect.level.addModifier(levelModifier,levelModifier); //升了1级
    
        expect(effect.toString()).to.eql("力量增加40");
        
        //此时str = 10+ (20 + 2*10) = 40
        expect(target.attr.str.getVal()).to.eql(40);
    
    
        //然后移除效果
        effect.onUninstall();
        expect(target.attr.str.getVal()).to.eql(40);
    
        expect(effect.toString()).to.eql("str增加40");
    });
    
    it("should decrease work", function () {
        //定义了一个修改属性的效果：初始20，等级因子是10，当前等级是1，增长曲线是线性
        let effect = new attributeReset({
            name:"attributeReset",
            desc:"修正属性",
            level:new integer(1),
            params:{
                attrName:"str",
                mode:"dec",
                basePoint:20,
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
        
        //此时str = 100- (20 + 1*10) = 70
        expect(target.attr.str.getVal()).to.eql(70);
        
        //然后给effect进行升级(对于reset效果，不是附着在对象上面，所以应该不变)
        let levelModifier ={addVal:new integer(1)};
        effect.level.addModifier(levelModifier,levelModifier); //升了1级
        //此时str = 100- (20 + 1*10) = 70
        expect(target.attr.str.getVal()).to.eql(70);
    
    
        //然后移除效果
        effect.onUninstall();
        expect(target.attr.str.getVal()).to.eql(70);
    });
    
});
