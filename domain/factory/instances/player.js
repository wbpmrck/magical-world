/**
 * Created by kaicui on 17/10/27.
 */

const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {Player} = require("../../player/player");
const {ref,seed} = require("../factory");

module.exports={
    //定义hero工厂可以创建的实例列表
    instances:[
        {
            singleton:true, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"shinhwa",
            constructor:Player,
            params:[
                {
                    id:seed(),
                    account:"shinhwa001", //登录名
                    name:"shinhwa", //昵称
                    avatar:"", //头像
                    vipLevel:1, //vip等级，默认0，不是vip
                }
            ]
        },
        {
            singleton:true, //如果是true,代表该实例全局只产生一个。否则每次获取本key的实例，都产生多个
            key:"weatherpop",
            constructor:Player,
            params:[
                {
                    id:seed(),
                    account:"weatherpop01", //登录名
                    name:"weatherpop", //昵称
                    avatar:"", //头像
                    vipLevel:1, //vip等级，默认0，不是vip
                }
            ]
        }
        
    ]
}