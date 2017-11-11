/**
 * Created by kaicui on 17/10/27.
 */

const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {WordLifeCycle,BattleEvents,HeroEvents} = require("../../mechanism/lifeCycle");
const {SkillItem,Skill,SkillType} = require("../../skill/skill");
const {HeroBaseAttributes,HeroDeriveAttributes,HeroOtherAttributes} = require("../../mechanism/role/attributeRule");
const {ref,seed} = require("../factory");
const statusEnum = require("../../effect/implement/statusEnum");

module.exports={
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
                            installCycle:undefined, //(可空)在什么生命周期去触发里面的effect的install
                            targetChooserName:"enemyPositionOrderChooser", //选择最靠前的，活着的敌人
                            targetChooserParams:{count:1,mode:0,from:0,alive:true},//chooser需要的参数，从0号位置向后查找，选择1个活着的敌人
                            effects:[
                                {
                                    //基于使用者ATK与对象DEF计算得到的伤害
                                    effectName:"damageByATKAndDEF", //普通伤害计算
                                    effectParams:{
                                        isMagic:false, //是否魔法攻击（决定计算参数是ATK还是MATK)
                                        canFlee:true, //可以被躲避
                                        atkRatePerLevel:0,//普通攻击的伤害，不随着等级提升增加
                                        increase:'linear',//等级提升，atk增长函数
                                        atkRate:1000,// ATK按照1000/1000倍率 计算（1倍）
                                        ignoreDEF:0, //是否无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）
                                        
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
                                        icon:"atk-up",
                                        removeAfterBattle:true,
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
                                        icon:"hp-up",
                                        removeAfterBattle:true,
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
        },
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"涅磐1",
            constructor:Skill,
            params:[
                {
                    levelCur:1, //number，表示当前等级
                    levelMax:10, //number，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },{
                    type:SkillType.PASSIVE,// SkillType 枚举，表示主动/被动
                    id:1, //技能id
                    name:"涅磐1", //技能名称
                    desc:"英雄死亡之后,下回合开始前复活(只触发1次)，恢复50%的HP,SP", //技能描述
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
                                    effectName:"reborn",
                                    effectParams:{
                                        icon:"reborn",
                                        continueTurn:'ever', //一直持续
                                        removeAfterBattle:true,
                                        delayTurn:1,//死亡后，在下一回合开始的时候才复活
                                        recoverHpRate:400,//基础恢复40%hp
                                        recoverHpRatePerLevel:100,//提升1级，多10%
                                        recoverHpRateIncrease:"linear",//
    
                                        recoverSpRate:400,//基础恢复40%sp
                                        recoverSpRatePerLevel:100,//提升1级，多10%
                                        recoverSpRateIncrease:"linear",//
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
                    desc:"使用时,对所有敌人造成120%ATK的物理伤害，无视防御，必中", //技能描述
                    items:[
                        {
                            id:seed(), //技能项id
                            probability:1000,//Integer 对象，表示成功释放概率
                            installCycle:undefined, //(可空)在什么生命周期去触发里面的effect的install
                            targetChooserName:"allEnemyChooser", //选择所有活着的敌人
                            targetChooserParams:{alive:true},//chooser需要的参数
                            effects:[
                                {
                                    //造成无视防御的伤害
                                    effectName:"damageByATKAndDEF",
                                    effectParams:{
                                        isMagic:false, //是否魔法攻击（决定计算参数是ATK还是MATK)
                                        canFlee:false, //无法躲避，必中
                                        atkRate:1000,// ATK按照1000/1000倍率 计算（1倍）
                                        increase:'linear',//等级提升，atk增长函数
                                        atkRatePerLevel:200,//每提升1级，多20% atk参与计算
                                        ignoreDEF:1000, //是否无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）数字，则表示无视多少比率的防御(千分比）
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
            key:"毒雾1",
            constructor:Skill,
            params:[
                {
                    levelCur:1, //number，表示当前等级
                    levelMax:10, //number，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },{
                    type:SkillType.ACTIVE,// SkillType 枚举，表示主动/被动
                    id:1, //技能id
                    name:"毒雾1", //技能名称
                    desc:"使用时,对所有敌人造成30%ATK的物理伤害，无视防御。同时有50%的概率使敌人中毒，每回合造成 60%M_ATK的毒素伤害(致死、无视防御)，持续2回合", //技能描述
                    items:[
                        {
                            id:seed(), //技能项id
                            probability:1000,//Integer 对象，表示成功释放概率
                            installCycle:undefined, //(可空)在什么生命周期去触发里面的effect的install
                            targetChooserName:"allEnemyChooser", //选择所有活着的敌人
                            targetChooserParams:{alive:true},//chooser需要的参数
                            effects:[
                                {
                                    //对所有敌人造成30%ATK的物理伤害，无视防御
                                    effectName:"damageByATKAndDEF",
                                    effectParams:{
                                        isMagic:false, //是否魔法攻击（决定计算参数是ATK还是MATK)
                                        canFlee:false, //无法躲避，必中
                                        atkRate:300,// ATK按照1000/1000倍率 计算（1倍）
                                        increase:'linear',//等级提升，atk增长函数
                                        atkRatePerLevel:0,//每提升1级，多20% atk参与计算
                                        ignoreDEF:1000, //是否无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）数字，则表示无视多少比率的防御(千分比）
                                    }
                                },
                                {
                                    //敌人中毒，每回合造成 60%M_ATK的毒素伤害(致死、无视防御)，持续2回合
                                    effectName:"poison",
                                    effectPossibility:500,//概率
                                    effectParams:{
                                        icon:"poison",
                                        continueTurn:2, //回合数
                                        deadly:true,//此毒素效果致死
                                        isMagic:true, //是魔法攻击（决定计算参数是ATK还是MATK)
                                        atkRatePerLevel:500,//每提升1级，增加50%伤害
                                        increase:'linear',//等级提升，atk增长函数
                                        atkRate:100,// 基础伤害，10%
                                        ignoreDEF:1000, //非无视防御
                                        removeAfterBattle:true,
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
            key:"雷暴1",
            constructor:Skill,
            params:[
                {
                    levelCur:1, //number，表示当前等级
                    levelMax:10, //number，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },{
                    type:SkillType.ACTIVE,// SkillType 枚举，表示主动/被动
                    id:1, //技能id
                    name:"雷暴1", //技能名称
                    desc:"使用时,对所有敌人造成90%ATK的物理伤害，并有30%几率眩晕敌人2回合", //技能描述
                    items:[
                        {
                            id:seed(), //技能项id
                            probability:1000,//Integer 对象，表示成功释放概率
                            installCycle:undefined, //(可空)在什么生命周期去触发里面的effect的install
                            targetChooserName:"allEnemyChooser", //选择所有活着的敌人
                            targetChooserParams:{alive:true},//chooser需要的参数
                            effects:[
                                {
                                    //造成无视防御的伤害
                                    effectName:"damageByATKAndDEF",
                                    effectParams:{
                                        isMagic:false, //是否魔法攻击（决定计算参数是ATK还是MATK)
                                        canFlee:false, //无法躲避，必中
                                        atkRate:1000,// ATK按照1000/1000倍率 计算（1倍）
                                        increase:'linear',//等级提升，atk增长函数
                                        atkRatePerLevel:200,//每提升1级，多20% atk参与计算
                                        ignoreDEF:0, //是否无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）数字，则表示无视多少比率的防御(千分比）
                                    }
                                },
                                {
                                    //概率造成眩晕
                                    effectName:"status",
                                    effectPossibility:300,//眩晕概率
                                    effectParams:{
                                        icon:"dizzy",
                                        removeAfterBattle:true,
                                        status:statusEnum.Dizzy, //状态：眩晕
                                        continueTurn:2, //回合数
                                        stopAction:true,
                                        stopSkill:true,
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
            key:"暴风雪1",
            constructor:Skill,
            params:[
                {
                    levelCur:1, //number，表示当前等级
                    levelMax:10, //number，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },{
                    type:SkillType.ACTIVE,// SkillType 枚举，表示主动/被动
                    id:1, //技能id
                    name:"暴风雪1", //技能名称
                    desc:"使用时,对所有敌人造成90%ATK的魔法伤害，并有30%几率冰冻敌人2回合", //技能描述
                    items:[
                        {
                            id:seed(), //技能项id
                            probability:1000,//Integer 对象，表示成功释放概率
                            installCycle:undefined, //(可空)在什么生命周期去触发里面的effect的install
                            targetChooserName:"allEnemyChooser", //选择所有活着的敌人
                            targetChooserParams:{alive:true},//chooser需要的参数
                            effects:[
                                {
                                    //造成无视防御的伤害
                                    effectName:"damageByATKAndDEF",
                                    effectParams:{
                                        isMagic:true, //是否魔法攻击（决定计算参数是ATK还是MATK)
                                        canFlee:false, //无法躲避，必中
                                        atkRate:700,// ATK按照1000/1000倍率 计算（1倍）
                                        increase:'linear',//等级提升，atk增长函数
                                        atkRatePerLevel:200,//每提升1级，多20% atk参与计算
                                        ignoreDEF:0, //是否无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）数字，则表示无视多少比率的防御(千分比）
                                    }
                                },
                                {
                                    //概率造成冰冻
                                    effectName:"status",
                                    effectPossibility:300,//概率
                                    effectParams:{
                                        icon:"frozen",
                                        removeAfterBattle:true,
                                        status:statusEnum.Frozen, //状态：眩晕
                                        continueTurn:2, //回合数
                                        stopAction:true,
                                        stopSkill:true,
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
            key:"封禁1",
            constructor:Skill,
            params:[
                {
                    levelCur:1, //number，表示当前等级
                    levelMax:10, //number，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },{
                    type:SkillType.ACTIVE,// SkillType 枚举，表示主动/被动
                    id:1, //技能id
                    name:"封禁1", //技能名称
                    desc:"使用时,对所有敌人造成90%M_ATK的魔法伤害，并有50%几率沉默敌人2回合", //技能描述
                    items:[
                        {
                            id:seed(), //技能项id
                            probability:1000,//Integer 对象，表示成功释放概率
                            installCycle:undefined, //(可空)在什么生命周期去触发里面的effect的install
                            targetChooserName:"allEnemyChooser", //选择所有活着的敌人
                            targetChooserParams:{alive:true},//chooser需要的参数
                            effects:[
                                {
                                    //造成伤害
                                    effectName:"damageByATKAndDEF",
                                    effectParams:{
                                        isMagic:true, //是否魔法攻击（决定计算参数是ATK还是MATK)
                                        canFlee:false, //无法躲避，必中
                                        atkRate:700,// ATK按照1000/1000倍率 计算（1倍）
                                        increase:'linear',//等级提升，atk增长函数
                                        atkRatePerLevel:200,//每提升1级，多20% atk参与计算
                                        ignoreDEF:0, //是否无视对方防御力（神圣攻击）（但是仍然收到减伤等因素影响）数字，则表示无视多少比率的防御(千分比）
                                    }
                                },
                                {
                                    //概率造成沉默
                                    effectName:"status",
                                    effectPossibility:500,//概率
                                    effectParams:{
                                        icon:"silence",
                                        removeAfterBattle:true,
                                        status:statusEnum.SILENCE, //状态：眩晕
                                        continueTurn:2, //回合数
                                        stopAction:false,
                                        stopSkill:true,
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