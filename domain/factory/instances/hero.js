/**
 * Created by kaicui on 17/10/27.
 */

const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {Hero} = require("../../mechanism/role/hero");
const {HeroBaseAttributes,HeroOtherAttributes} = require("../../mechanism/role/attributeRule");
const {CAMPS, RACES,getRaceCamp} = require("../../mechanism/role/camp");
const {JOBS} = require("../../mechanism/role/job");
const {ref,seed} = require("../factory");

module.exports={
    //定义hero工厂可以创建的实例列表
    instances:[
    
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"测试hero(hp10,sp10)",
            constructor:Hero,
            params:[
                {
                    levelCur:1, //number,或者Integer 对象，表示当前等级
                    levelMax:99, //number,或者Integer 对象，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },
                {
                
                    id:seed(),//英雄id
                    name:`测试hero(hp10,sp10)`,//英雄名称
                    skills:[
                    ],
                
                    raceCampCode:RACES.LIGHT.code, //种族&阵营编号
                    jobCode:JOBS.WARRIOR.code, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        [HeroBaseAttributes.STR]:10,
                        [HeroBaseAttributes.AGI]:10,
                        [HeroBaseAttributes.VIT]:10,
                        [HeroBaseAttributes.INT]:10,
                        [HeroBaseAttributes.DEX]:10,
                        [HeroBaseAttributes.LUK]:10,
                        [HeroOtherAttributes.HP]:10,
                        [HeroOtherAttributes.SP]:10,
                        [HeroOtherAttributes.SP_MAX]:50,
                        [HeroOtherAttributes.CRI_ATK]:0,
                        [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                        [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                        [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                        [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
                    }
                }
            ]
        },
        
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"光战1",
            constructor:Hero,
            params:[
                {
                    levelCur:2, //number,或者Integer 对象，表示当前等级
                    levelMax:99, //number,或者Integer 对象，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },
                {
                
                    id:seed(),//英雄id
                    name:`光战1`,//英雄名称
                    skills:[
                        ref({key:'普攻1'}),
                        ref({key:'狂击1'}),
                        ref({key:'狂热1'}),
                        
                    ],
                    
                    raceCampCode:RACES.LIGHT.code, //种族&阵营编号
                    jobCode:JOBS.WARRIOR.code, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        [HeroBaseAttributes.STR]:30,
                        [HeroBaseAttributes.AGI]:70,
                        [HeroBaseAttributes.VIT]:30,
                        [HeroBaseAttributes.INT]:10,
                        [HeroBaseAttributes.DEX]:30,
                        [HeroBaseAttributes.LUK]:250,
                        [HeroOtherAttributes.HP]:146,
                        [HeroOtherAttributes.SP]:0,
                        [HeroOtherAttributes.SP_MAX]:50,
                        [HeroOtherAttributes.CRI_ATK]:0,
                        [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                        [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                        [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                        [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
                    }
                }
            ]
        },
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"光战2",
            constructor:Hero,
            params:[
                {
                    levelCur:2, //number,或者Integer 对象，表示当前等级
                    levelMax:99, //number,或者Integer 对象，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },
                {
                
                    id:seed(),//英雄id
                    name:`光战2`,//英雄名称
                    skills:[
                        ref({key:'普攻1'}),
                        ref({key:'狂击1'}),
                        ref({key:'涅磐1'}),
                        
                    ],
                    
                    raceCampCode:RACES.LIGHT.code, //种族&阵营编号
                    jobCode:JOBS.WARRIOR.code, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        [HeroBaseAttributes.STR]:20,
                        [HeroBaseAttributes.AGI]:70,
                        [HeroBaseAttributes.VIT]:25,
                        [HeroBaseAttributes.INT]:12,
                        [HeroBaseAttributes.DEX]:30,
                        [HeroBaseAttributes.LUK]:150,
                        [HeroOtherAttributes.HP]:110,
                        [HeroOtherAttributes.SP]:0,
                        [HeroOtherAttributes.SP_MAX]:40,
                        [HeroOtherAttributes.CRI_ATK]:0,
                        [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                        [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                        [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                        [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
                    }
                }
            ]
        },
    
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"冰法1",
            constructor:Hero,
            params:[
                {
                    levelCur:2, //number,或者Integer 对象，表示当前等级
                    levelMax:99, //number,或者Integer 对象，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },
                {
                
                    id:seed(),//英雄id
                    name:`冰法1`,//英雄名称
                    skills:[
                        ref({key:'普攻1'}),
                        ref({key:'暴风雪1'}),
                        ref({key:'狂热1'}),
                
                    ],
                
                    raceCampCode:RACES.HUMAN.code, //种族&阵营编号
                    jobCode:JOBS.MAGE.code, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        [HeroBaseAttributes.STR]:10,
                        [HeroBaseAttributes.AGI]:70,
                        [HeroBaseAttributes.VIT]:24,
                        [HeroBaseAttributes.INT]:40,
                        [HeroBaseAttributes.DEX]:30,
                        [HeroBaseAttributes.LUK]:150,
                        [HeroOtherAttributes.HP]:126,
                        [HeroOtherAttributes.SP]:0,
                        [HeroOtherAttributes.SP_MAX]:50,
                        [HeroOtherAttributes.CRI_ATK]:0,
                        [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                        [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                        [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                        [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
                    }
                }
            ]
        },
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"毒刺客1",
            constructor:Hero,
            params:[
                {
                    levelCur:2, //number,或者Integer 对象，表示当前等级
                    levelMax:99, //number,或者Integer 对象，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },
                {
                
                    id:seed(),//英雄id
                    name:`毒刺客1`,//英雄名称
                    skills:[
                        ref({key:'普攻1'}),
                        ref({key:'毒雾1'}),
                        ref({key:'狂热1'}),
                
                    ],
                
                    raceCampCode:RACES.HUMAN.code, //种族&阵营编号
                    jobCode:JOBS.ASSASSIN.code, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        [HeroBaseAttributes.STR]:10,
                        [HeroBaseAttributes.AGI]:80,
                        [HeroBaseAttributes.VIT]:15,
                        [HeroBaseAttributes.INT]:40,
                        [HeroBaseAttributes.DEX]:30,
                        [HeroBaseAttributes.LUK]:170,
                        [HeroOtherAttributes.HP]:100,
                        [HeroOtherAttributes.SP]:0,
                        [HeroOtherAttributes.SP_MAX]:40,
                        [HeroOtherAttributes.CRI_ATK]:0,
                        [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                        [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                        [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                        [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
                    }
                }
            ]
        },
    
        {
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"术士1",
            constructor:Hero,
            params:[
                {
                    levelCur:2, //number,或者Integer 对象，表示当前等级
                    levelMax:99, //number,或者Integer 对象，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },
                {
                
                    id:seed(),//英雄id
                    name:`术士1`,//英雄名称
                    skills:[
                        ref({key:'普攻1'}),
                        ref({key:'封禁1'}),
                        ref({key:'狂热1'}),
                
                    ],
                
                    raceCampCode:RACES.HUMAN.code, //种族&阵营编号
                    jobCode:JOBS.WARLOCK.code, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        [HeroBaseAttributes.STR]:10,
                        [HeroBaseAttributes.AGI]:50,
                        [HeroBaseAttributes.VIT]:29,
                        [HeroBaseAttributes.INT]:50,
                        [HeroBaseAttributes.DEX]:30,
                        [HeroBaseAttributes.LUK]:120,
                        [HeroOtherAttributes.HP]:126,
                        [HeroOtherAttributes.SP]:0,
                        [HeroOtherAttributes.SP_MAX]:50,
                        [HeroOtherAttributes.CRI_ATK]:0,
                        [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                        [HeroOtherAttributes.IGNORE_M_DEF]:500, //无视魔法防御的比率(千分比)
                        [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                        [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
                    }
                }
            ]
        }
        ,{
            singleton:false, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"地狱游侠1",
            constructor:Hero,
            params:[
                {
                    levelCur:1, //number,或者Integer 对象，表示当前等级
                    levelMax:99, //number,或者Integer 对象，表示最高等级
                    exp:0, // number,表示当前获得的经验值
                },
                {
                
                    id:seed(),//英雄id
                    name:`地狱游侠1`,//英雄名称
                    skills:[
                        ref({key:'普攻1'}),
                        ref({key:'雷暴1'}),
                        ref({key:'狂热1'}),
                    ],
                    raceCampCode:RACES.HELL.code, //种族&阵营编号
                    jobCode:JOBS.KNIGHT.code, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        [HeroBaseAttributes.STR]:30,
                        [HeroBaseAttributes.AGI]:70,
                        [HeroBaseAttributes.VIT]:24,
                        [HeroBaseAttributes.INT]:20,
                        [HeroBaseAttributes.DEX]:10,
                        [HeroBaseAttributes.LUK]:150,
                        [HeroOtherAttributes.HP]:112,
                        [HeroOtherAttributes.SP]:0,
                        [HeroOtherAttributes.SP_MAX]:50,
                        [HeroOtherAttributes.CRI_ATK]:0,
                        [HeroOtherAttributes.IGNORE_DEF]:0, //无视物理防御的比率(千分比)
                        [HeroOtherAttributes.IGNORE_M_DEF]:0, //无视魔法防御的比率(千分比)
                        [HeroOtherAttributes.REDUCE_ATK]:0, //减少物理伤害比率(千分比)
                        [HeroOtherAttributes.REDUCE_M_ATK]:0, //减少魔法伤害比率(千分比)
                    }
                }
            ]
        }
        
    ]
}