/**
 * Created by kaicui on 17/8/22.
 * 定义角色具备的属性，以及属性之间的换算关系
 */

const Attribute = require("../../attribute/attribute");
const ComputeAttribute = require("../../attribute/computeAttr");
let iota=20;
const HeroBaseAttributes={
    STR:iota++,
    AGI:iota++,
    DEX:iota++,
    INT:iota++,
    VIT:iota++,
    LUK:iota++,
};

const HeroBattleAttributes={
    
    
    HP:iota++, //血量
    HP_MAX:iota++, //最大血量
    SP:iota++, //怒气值
    SP_MAX:iota++, //怒气值上限
    
    ATK:iota++, //攻击力
    DEF:iota++, //防御力
    SPD:iota++, //速度
    FLEE:iota++,   //闪避(千分比)
    HIT:iota++, //命中(千分比)
    CRI:iota++, //暴击率(千分比)
    CRI_ATK:iota++, //暴击伤害加成(千分比)
    
}
let  ruleMap= {
    [HeroBattleAttributes.ATK]: function (str, agi, level) {
        return str * 50 + agi * 2 +level.getVal()*Math.pow(str,2);
    }
}

module.exports={
    
    ruleMap,
    /**
     * 根据基本属性值，把所有属性注入到指定对象
     * @param attributeCarrier
     * @param str
     * @param agi
     * @param vit
     * @param int
     * @param dex
     * @param luk
     */
    injectHeroAttributes:function (attributeCarrier,{str,agi, vit, int, dex, luk}) {
        
        // 基础属性
        let strArr=new Attribute(HeroBaseAttributes.STR,"力量",str);
        let agiArr=new Attribute(HeroBaseAttributes.AGI,"敏捷",agi);
        let vitArr=new Attribute(HeroBaseAttributes.VIT,"体质",vit);
        let intArr=new Attribute(HeroBaseAttributes.VIT,"智力",int);
        let dexArr=new Attribute(HeroBaseAttributes.DEX,"灵巧",dex);
        let lukArr=new Attribute(HeroBaseAttributes.LUK,"运气",luk);
        attributeCarrier.addAttr(strArr).addAttr(agiArr).addAttr(vitArr).addAttr(intArr).addAttr(dexArr).addAttr(lukArr);
        
        //战斗属性
        let atk = new ComputeAttribute(HeroBattleAttributes.ATK,"攻击力",undefined,[strArr,agiArr,attributeCarrier.levelCur],([_str,_agi,_level],cb)=>{
            cb(ruleMap[HeroBattleAttributes.ATK](_str,_agi,_level)); //atk = str*50+agi*2
        });
        //todo:添加其他属性的计算公式，并赋值s
    
    
    }
}