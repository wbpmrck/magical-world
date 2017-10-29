/**
 * Created by kaicui on 17/10/27.
 */

const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {WordLifeCycle,BattleEvents,HeroEvents} = require("../../mechanism/lifeCycle");
const {SkillItem,Skill,SkillType} = require("../../skill/skill");
const {HeroBaseAttributes,HeroDeriveAttributes,HeroOtherAttributes} = require("../../mechanism/role/attributeRule");
const {ref,seed} = require("../factory");

module.exports={
    //定义hero工厂可以创建的实例列表
    instances:[
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"普攻1",
            constructor:Skill,
            params:[
                {
                    levelCur:1, //number，表示当前等级
                    levelMax:10, //number，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },{
                    type:SkillType.ACTIVE,// SkillType 枚举，表示主动/被动
                    id:1, //技能id
                    name:"普攻1", //技能名称
                    desc:"使对象受到:基于使用者ATK与对象DEF计算得到的伤害(区分魔法、物理)", //技能描述
                    items:[
                        {
                            id:seed(), //技能项id
                            probability:1000,//Integer 对象，表示成功释放概率
                            installCycle:BattleEvents.BATTLE_BEGIN, //(可空)在什么生命周期去触发里面的effect的install
                            targetChooserName:"enemyPositionOrderChooser", //选择最靠前的，活着的敌人
                            targetChooserParams:{count:1,mode:0,from:0,alive:true},//chooser需要的参数，从0号位置向后查找，选择1个活着的敌人
                            effects:[
                                {
                                    //基于使用者ATK与对象DEF计算得到的伤害
                                    effectName:"damageByATKAndDEF", //普通伤害计算
                                    effectParams:{
                                        isMagic:false, //是否魔法攻击（决定计算参数是ATK还是MATK)
                                        
                                        atkRate:1000,// ATK按照1000/1000倍率 计算（1倍）
                                        ignoreDEF:false, //是否无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）
                                        
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"狂热1",
            constructor:Skill,
            params:[
                {
                    levelCur:1, //number，表示当前等级
                    levelMax:10, //number，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },{
                    type:SkillType.PASSIVE,// SkillType 枚举，表示主动/被动
                    id:1, //技能id
                    name:"狂热1", //技能名称
                    desc:"战斗开始时,大幅提升HP上限、攻击力3回合", //技能描述
                    items:[
                        {
                            id:seed(), //技能项id
                            probability:1000,//Integer 对象，表示成功释放概率
                            installCycle:BattleEvents.BATTLE_BEGIN, //(可空)在什么生命周期去触发里面的effect的install
                            targetChooserName:"SelfChooser", //技能对象，应该是持有者自己
                            targetChooserParams:undefined,//chooser需要的参数:无
                            effects:[
                                {
                                    //攻击力提升效果
                                    effectName:"attributeModifyByPercent",
                                    effectParams:{
                                        attrName:HeroDeriveAttributes.ATK,
                                        continueTurn:3, //持续3回合
                                        mode:"inc",
                                        basePercent:100, //基础增加 100/1000 = 10%
                                        levelFactor:10,
                                        increase:"linear"
                                    }
                                },
                                {
                                    //HP_MAX提升效果
                                    effectName:"attributeModifyByPercent",
                                    effectParams:{
                                        attrName:HeroDeriveAttributes.HP_MAX,
                                        continueTurn:3, //3回合消失
                                        mode:"inc",
                                        basePercent:100, //基础增加 100/1000 = 10%
                                        levelFactor:10,
                                        increase:"linear"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
      ,
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"狂击1",
            constructor:Skill,
            params:[
                {
                    levelCur:1, //number，表示当前等级
                    levelMax:10, //number，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },{
                    type:SkillType.ACTIVE,// SkillType 枚举，表示主动/被动
                    id:1, //技能id
                    name:"狂击1", //技能名称
                    desc:"使用时,对所有敌人造成120%ATK的物理伤害，无视防御", //技能描述
                    items:[
                        {
                            id:seed(), //技能项id
                            probability:1000,//Integer 对象，表示成功释放概率
                            installCycle:BattleEvents.BATTLE_BEGIN, //(可空)在什么生命周期去触发里面的effect的install
                            targetChooserName:"allEnemyChooser", //选择所有活着的敌人
                            targetChooserParams:{alive:true},//chooser需要的参数
                            effects:[
                                {
                                    //造成无视防御的伤害
                                    effectName:"damageByATKAndDEF",
                                    effectParams:{
                                        isMagic:false, //是否魔法攻击（决定计算参数是ATK还是MATK)
                                        atkRate:1200,// ATK按照1000/1000倍率 计算（1倍）
                                        ignoreDEF:true, //是否无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
      
    ]
}