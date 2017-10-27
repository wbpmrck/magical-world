/**
 * Created by kaicui on 17/10/27.
 */

const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {Hero} = require("../../mechanism/role/hero");
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
                    raceCampCode:RACES.LIGHT, //种族&阵营编号
                    jobCode:JOBS.WARRIOR, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        STR:30,
                        AGI:10,
                        VIT:30,
                        INT:10,
                        DEX:30,
                        LUK:10
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
                    raceCampCode:RACES.HELL, //种族&阵营编号
                    jobCode:JOBS.KNIGHT, //职业编号
                    starLevel:1,//number,星数
                    rawAttributes:{
                        STR:20,
                        AGI:20,
                        VIT:20,
                        INT:20,
                        DEX:10,
                        LUK:10
                    }
                }
            ]
        }
        
    ]
}