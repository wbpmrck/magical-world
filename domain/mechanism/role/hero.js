/**
 * Created by kaicui on 17/8/22.
 * 表示战场上的一个英雄
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;
const Levelable = require("../../level/levelable");
const {getCamp} = require("./camp");
const {getJob} = require("./job");
const {Star} = require("./star");
const {injectHeroAttributes} = require("./attributeRule");


let Hero = oop.defineClass({
    super:Levelable,
    constructor:function({
        levelCur, //number,或者Integer 对象，表示当前等级
        levelMax, //number,或者Integer 对象，表示最高等级
        exp, // number,表示当前获得的经验值
        expTableName="small_03", // String，表示经验值增长曲线名称
    },{
        campCode, //种族&阵营编号
        jobCode, //职业编号
        starLevel,//number,星数
        
        rawAttributes, //属性对象，包含需要持久化的所有角色属性数据。如：str,agi,vit,int,dex,luk,hp,sp等
    }){
        var self = this;
        
        //6项基本属性的初始化，以及对应的附加属性初始化
        injectHeroAttributes(self,rawAttributes);
        
        self.camp = getCamp(campCode);//种族&阵营
        self.job = getJob(jobCode);//职业
        self.star = new Star(starLevel);//星级
        
        // self.vital = vital;//精气点数
        
    },
    prototype:{
        
    }
});

module.exports = {Hero};

