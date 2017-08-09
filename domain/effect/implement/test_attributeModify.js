/**
 * Created by kaicui on 17/8/5.
 */


const expect = require('chai').expect;
const attributeModify = require("./attributeModify");
const integer = require("../../value/integer");

const Attribute = require("../../attribute/attribute");



describe("attributeModify :", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should work", function () {
        //定义了一个修改属性的效果：初始20，等级因子是10，当前等级是1，增长曲线是线性
        let effect = new attributeModify({
            name:"attributeModify",
            desc:"修正属性",
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
        let source = {};//假的作用源
        effect.onInstall(source,target);
        
        //此时str = 10+ (20 + 1*10) = 40
        expect(target.attr.str.getVal()).to.eql(40);
        
        //然后给effect进行升级
        let levelModifier ={addVal:new integer(1)};
        effect.level.addModifier(levelModifier,levelModifier); //升了1级
        //此时str = 10+ (20 + 2*10) = 40
        expect(target.attr.str.getVal()).to.eql(50);
        
        //然后给effect进行再次升级
        levelModifier.addVal.addModifier({},{addVal:1}); //又升了1级
        //此时str = 10+ (20 + 3*10) = 60
        expect(target.attr.str.getVal()).to.eql(60);
    });
    
});
