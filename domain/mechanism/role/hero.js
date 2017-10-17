/**
 * Created by kaicui on 17/8/22.
 * 表示战场上的一个英雄
 *
 * 注意：
 * 1、hero被添加到一个team之后，可能会被注入一些属性，比如team属性
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const Levelable = require("../../level/levelable");
const {getRaceCamp} = require("./camp");
const {getJob} = require("./job");
const {Star} = require("./star");
const {injectHeroAttributes} = require("./attributeRule");

let iota=1000;
const HeroEvents={
    
    BEFORE_ACTION:iota++,
    AFTER_ACTION:iota++,
    
    BEFORE_MUTATION:iota++,
    AFTER_MUTATION:iota++,
};


let Hero = oop.defineClass({
    super:Levelable,
    constructor:function({
        levelCur, //number,或者Integer 对象，表示当前等级
        levelMax, //number,或者Integer 对象，表示最高等级
        exp, // number,表示当前获得的经验值
        expTableName="small_03", // String，表示经验值增长曲线名称
    },{
        id,//英雄id
        name,//英雄名称
        raceCampCode, //种族&阵营编号
        jobCode, //职业编号
        starLevel,//number,星数
        
        rawAttributes, //属性对象，包含需要持久化的所有角色属性数据。如：str,agi,vit,int,dex,luk,hp,sp等
    }){
        var self = this;
        self.id = id;
        self.name = name;
        
        //6项基本属性的初始化，以及对应的附加属性初始化
        injectHeroAttributes(self,rawAttributes);
        
        self.camp = getRaceCamp(raceCampCode);//种族&阵营
        self.job = getJob(jobCode);//职业
        self.star = new Star(starLevel);//星级
        
        // self.vital = vital;//精气点数
        
    },
    prototype:{
        /** todo:拷贝出一个自身的副本
         * 副本：包含的基本属性、装备与本体是关联的，含部分自定义信息，包括：
         * hp值，怒气，效果列表等
         */
        copy:function () {
            
        },
        //todo:hero触发一个主动行为，比如普通攻击，或者技能攻击
        takeAction:function () {
            
        },
        //todo:hero 接收一个修改请求，比如修改Hp等
        takeMutation:function (mutation) {
            
        }
    }
});

module.exports = {Hero,HeroEvents};

