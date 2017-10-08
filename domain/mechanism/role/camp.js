/**
 * Created by kaicui on 17/8/22.
 * 定义种族&阵营
 * 1、阵营具有相生相克
 * 2、种族决定了阵营所属
 */

const oop = require("local-libs").oop;
const event = require("local-libs").event;
let iota=1;

//阵营编码
let CAMPS={
    JUSTICE:{
        code:1,
        name:"JUSTICE"
    },  //正义
    NEUTRAL:{
        code:0,
        name:"NEUTRAL"
    },  //中立
    EVIL:{
        code:2,
        name:"EVIL"
    },     //邪恶
};

const RACES= {
    LIGHT: {
        code:iota++,
        camp:CAMPS.JUSTICE
    }, //圣光
    HUMAN: {
        code:iota++,
        camp:CAMPS.JUSTICE
    }, //人类
    DWARF: {
        code:iota++,
        camp:CAMPS.JUSTICE
    }, //矮人
    HELL: {
        code:iota++,
        camp:CAMPS.EVIL
    }, //地狱
    TROLL: {
        code:iota++,
        camp:CAMPS.EVIL
    }, //巨魔
    UNDEAD: {
        code:iota++,
        camp:CAMPS.EVIL
    }, //不死
    DRUID: {
        code:iota++,
        camp:CAMPS.NEUTRAL
    }, //德鲁伊
    ENTS: {
        code:iota++,
        camp:CAMPS.NEUTRAL
    }, //树人
    ELF: {
        code:iota++,
        camp:CAMPS.NEUTRAL
    }, //精灵
};
var Race = oop.defineClass({
    super:undefined,
    constructor:function({code}){
        var self = this;
        for(var k in RACES){
            if(RACES[k].code===code){
                self.race = RACES[k]
                self.race.name =k ; //动态注入一个属性，就是种族名称
                break;
            }
        }
        
    },
    prototype:{
        getRaceCode:function () {
            return this.race.code
        },
        getRaceName:function () {
            return this.race.name
        },
        getCampCode:function () {
            return this.race.camp.code
        },
        getCampName:function () {
            return this.race.camp.name
        }
    }
});

/**
 * 返回阵营编码对应的阵营对象
 * @param campCode
 */
module.exports.getRaceCamp=function (raceCampCode) {
    return new Race({code:raceCampCode});
};