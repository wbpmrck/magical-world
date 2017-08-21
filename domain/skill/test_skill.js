/**
 * Created by kaicui on 17/8/20.
 */


const event = require("local-libs").event;
const oop = require("local-libs").oop;
const expect = require('chai').expect;
const  {SkillItem,Skill,SkillType} = require("./skill");
const {EffectAndAttrCarrier,EffectAndAttrCarrierLifeEvent} = require("../effect/effectAndAttrCarrier");
const {WordLifeCycle,CharLifeCycle} = require("../mechanism/lifeCycle");

describe("passivity skill", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should work with custom toString", function () {
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
        
        //create skill
        let skill1 = new Skill({
            levelCur:1, //number，表示当前等级
            levelMax:2, //number，表示最高等级
            exp:0, // number,表示当前获得的经验值
        },{
            type:SkillType.PASSIVE,// SkillType 枚举，表示主动/被动
            id:1, //技能id
            name:"无双", //技能名称
            desc:"让英雄具备在战场上出入无敌的技能", //技能描述
            holder:w1, //技能持有者对象 (可以是人，也可以是物品)
        });
        
        //create skillItem1
        let item1 =skill1.addSkillItem({
            id:1, //技能项id
            probability:1000,//Integer 对象，表示成功释放概率
            installCycle:undefined, //(可空)在什么生命周期去触发里面的effect的install
            targetChooserName:"SelfChooser", //技能对象，应该是持有者自己
            targetChooserParams:undefined,//chooser需要的参数:无
        });
    
        //添加力量提升效果
        item1.addEffectItem("attributeModifyByPercent",{
            attrName:"str",
            mode:"inc",
            basePercent:100, //基础增加 10 / 1000 = 1/100
            levelFactor:10,
            increase:"linear"
        });
        
        //添加敏捷提升效果
        item1.addEffectItem("attributeModifyByPercent",{
            attrName:"agi",
            mode:"inc",
            basePercent:100, //基础增加 10 / 1000 = 1/100
            levelFactor:10,
            increase:"linear"
        },(effect)=>{
            return `敏捷增加${Math.abs(effect.addPercent.total())/10}%`;
        });
    
        let desc = skill1.toString();
        expect(desc[0][0]).to.eql("str增加11%"); //默认effect.toString的结果
        expect(desc[0][1]).to.eql("敏捷增加11%"); //通过上面自定义模板输出的描述
        
    });
});
