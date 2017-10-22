/**
 * Created by kaicui on 17/8/22.
 * 定义角色具备的属性，以及属性之间的换算关系
 */

const Attribute = require("../../attribute/attribute");
const ComputeAttribute = require("../../attribute/computeAttr");
let iota=20;
const HeroBaseAttributes={
    STR:"STR", //力量
    AGI:"AGI", //敏捷
    DEX:"DEX", //协调
    INT:"INT", //智力
    VIT:"VIT", //体质
    LUK:"LUK", //运气
    // STR:iota++, //力量
    // AGI:iota++, //敏捷
    // DEX:iota++, //协调
    // INT:iota++, //智力
    // VIT:iota++, //体质
    // LUK:iota++, //运气
};
//给每个属性向上增加的时候，需要消耗的精气点数
const AttributeUpPoints=[
    {from:0,to:10,need:(curAttr)=>{return 2}}, //属性10以内，每次需要2个精气点来增加一个
    {from:10,to:20,need:(curAttr)=>{return 3}}, //属性20以内，每次需要3个精气点来增加一个
    {from:20,to:40,need:(curAttr)=>{return 5}}, //属性40以内，每次需要5个精气点来增加一个
    {from:40,to:60,need:(curAttr)=>{return 8}}, //属性60以内，每次需要8个精气点来增加一个
    {from:60,to:100,need:(curAttr)=>{return 13}}, //属性60以内，每次需要13个精气点来增加一个
    {from:100,need:(curAttr)=>{return 13+ Math.pow( 3,parseInt(curAttr/30)) + Math.pow(2,parseInt(curAttr/40))}}, //属性100以后，根据公式计算
]

//英雄衍生属性：依赖于基础属性计算
const HeroDeriveAttributes={
    HP_MAX:"HP_MAX", //最大血量
    
    ATK:"ATK", //攻击力（物理）
    DEF:"DEF", //防御力（物理）
    M_ATK:"M_ATK", //攻击力（魔法）
    M_DEF:"M_DEF", //防御力（魔法）
    SPD:"SPD", //速度
    FLEE:"FLEE",   //闪避(千分比)
    HIT:"HIT", //命中(千分比)
    CRI:"CRI", //暴击率(千分比)
    CRI_ATK:"CRI_ATK", //暴击伤害加成(千分比)
    
    // HP:iota++, //血量
    // HP_MAX:iota++, //最大血量
    // SP:iota++, //怒气值
    // SP_MAX:iota++, //怒气值上限
    //
    // ATK:iota++, //攻击力（物理）
    // DEF:iota++, //防御力（物理）
    // M_ATK:iota++, //攻击力（魔法）
    // M_DEF:iota++, //防御力（魔法）
    // SPD:iota++, //速度
    // FLEE:iota++,   //闪避(千分比)
    // HIT:iota++, //命中(千分比)
    // CRI:iota++, //暴击率(千分比)
    // CRI_ATK:iota++, //暴击伤害加成(千分比)
    
};
//英雄其他属性：不受基础属性影响
const HeroOtherAttributes={
    HP:"HP", //血量
    SP:"SP", //怒气值
    
    SP_MAX:"SP_MAX", //怒气值上限
    CRI_ATK:"CRI_ATK", //暴击伤害加成(千分比)
};


/*
    每一个项目，分别描述一个"衍生属性"对于"基本属性"的依赖情况、计算公式。
    
    计算公式是一个上下文无关的函数，他使用的输入都是数值类型。
    
    下面的"injectHeroAttributes"方法负责解析每一项的deps属性，来负责调用fomula,并且跟踪其依赖属性的变化情况
 */
let  ruleMap= {
    /**
     * 攻击力（物理）
     */
    [HeroDeriveAttributes.ATK]: {
        deps:[HeroBaseAttributes.STR,"levelCur"],
        fomula:function (str, level) {
            return str * 50 + level*Math.pow(str,2);
        }
    },
    /**
     * 最大Hp
     */
    [HeroDeriveAttributes.HP_MAX]: {
        deps:[HeroBaseAttributes.VIT,HeroBaseAttributes.INT,"levelCur"],
        fomula:function (vit, int, level) {
            return (vit * 50 - int * 2)*level +level*Math.pow(vit,2);
        }
    },
    /**
     * 攻击力（魔法）
     */
    [HeroDeriveAttributes.M_ATK]: {
        deps:[HeroBaseAttributes.INT,"levelCur"],
        fomula:function (int, level) {
            return int * 50 + level*Math.pow(int,2);
        }
    },
    /**
     * 防御力（物理）
     */
    [HeroDeriveAttributes.DEF]: {
        deps:[HeroBaseAttributes.VIT,"levelCur"],
        fomula:function (vit, level) {
            return vit * 30 + level*Math.pow(vit,2);
        }
    },
    /**
     * 防御力（魔法）
     */
    [HeroDeriveAttributes.M_DEF]: {
        deps:[HeroBaseAttributes.INT,HeroBaseAttributes.VIT,"levelCur"],
        fomula:function (int,vit, level) {
            return int * 30 + level*Math.pow(vit,2);
        }
    },
    /**
     * 速度
     */
    [HeroDeriveAttributes.SPD]: {
        deps:[HeroBaseAttributes.AGI,HeroBaseAttributes.VIT,"levelCur"],
        fomula:function (agi,vit, level) {
            return agi*3-vit+level;
        }
    },
    /**
     * 闪避
     */
    [HeroDeriveAttributes.FLEE]: {
        deps:[HeroBaseAttributes.STR,HeroBaseAttributes.AGI,HeroBaseAttributes.DEX,HeroBaseAttributes.VIT,HeroBaseAttributes.LUK,"levelCur"],
        fomula:function (str,agi,dex,vit,luk,level) {
            return agi+dex-str-vit+luk+level;
        }
    },
    /**
     * 命中
     */
    [HeroDeriveAttributes.HIT]: {
        deps:[HeroBaseAttributes.DEX,HeroBaseAttributes.VIT,HeroBaseAttributes.LUK,"levelCur"],
        fomula:function (dex,vit,luk,level) {
            return dex-vit+luk+level;
        }
    },
    /**
     * 暴击率
     */
    [HeroDeriveAttributes.CRI]: {
        deps:[HeroBaseAttributes.AGI,HeroBaseAttributes.LUK,"levelCur"],
        fomula:function (agi,luk,level) {
            return luk-agi+level;
        }
    }
}

module.exports={
    HeroBaseAttributes,
    HeroDeriveAttributes,
    HeroOtherAttributes,
    ruleMap,
    /**
     * 根据基本属性值，把所有属性注入到指定对象
     * @param attributeCarrier
     * @param rawAttributes:{str,agi, vit, int, dex, luk,hp,sp，SP_MAX，CRI_ATK}
     */
    injectHeroAttributes:function (attributeCarrier,rawAttributes) {
        
        //创建基础属性、其他属性对象，注入 attributeCarrier
        for(var attrName in rawAttributes){
            let attrRaw = rawAttributes[attrName];
            let attrObj = new Attribute(attrName,attrName,attrRaw);
            
            //注入
            attributeCarrier.addAttr(attrObj);
        }
        
        //创建"衍生属性"
        for(var deriveAttrName in ruleMap){
            let deps = ruleMap[deriveAttrName].deps;
            let attrDepsArray=[];
            
            for(var i=0,j=deps.length;i<j;i++){
                var depName = deps[i];
                let attr = attributeCarrier.getAttr(depName);
                if(attr===undefined){
                    attr=attributeCarrier[depName];
                }
                attrDepsArray.push(attr);
            }
    
            let deriveAttr = new ComputeAttribute(deriveAttrName,deriveAttrName,undefined,attrDepsArray,function (depArray,cb) {
                let valArray = depArray.map(attr=>attr.getVal());
                cb(ruleMap[this.name].fomula.apply(attributeCarrier,valArray));
            });
            //注入
            attributeCarrier.addAttr(deriveAttr);
        }
        
        // // 基础属性
        // let strArr=new Attribute(HeroBaseAttributes.STR,"力量",str);
        // let agiArr=new Attribute(HeroBaseAttributes.AGI,"敏捷",agi);
        // let vitArr=new Attribute(HeroBaseAttributes.VIT,"体质",vit);
        // let intArr=new Attribute(HeroBaseAttributes.VIT,"智力",int);
        // let dexArr=new Attribute(HeroBaseAttributes.DEX,"灵巧",dex);
        // let lukArr=new Attribute(HeroBaseAttributes.LUK,"运气",luk);
        // attributeCarrier.addAttr(strArr).addAttr(agiArr).addAttr(vitArr).addAttr(intArr).addAttr(dexArr).addAttr(lukArr);
        
        // //战斗属性
        // let atk = new ComputeAttribute(HeroBattleAttributes.ATK,"攻击力",undefined,[strArr,agiArr,attributeCarrier.levelCur],([_str,_agi,_level],cb)=>{
        //     cb(ruleMap[HeroBattleAttributes.ATK](_str,_agi,_level));
        // });
        
    
    
    }
}