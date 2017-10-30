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
                    
                    raceCampCode:RACES.LIGHT, //种族&阵营编号
                    jobCode:JOBS.WARRIOR, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        [HeroBaseAttributes.STR]:30,
                        [HeroBaseAttributes.AGI]:70,
                        [HeroBaseAttributes.VIT]:30,
                        [HeroBaseAttributes.INT]:10,
                        [HeroBaseAttributes.DEX]:30,
                        [HeroBaseAttributes.LUK]:150,
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
                        ref({key:'狂击1'}),
                        ref({key:'狂热1'}),
                    ],
                    raceCampCode:RACES.HELL, //种族&阵营编号
                    jobCode:JOBS.KNIGHT, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        [HeroBaseAttributes.STR]:20,
                        [HeroBaseAttributes.AGI]:70,
                        [HeroBaseAttributes.VIT]:20,
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