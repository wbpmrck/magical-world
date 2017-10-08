/**
 * Created by kaicui on 17/8/22.
 * 定义英雄职业
 * 1、英雄一个时刻只能属于一个职业
 * 2、不同职业对技能、属性具有一些影响、和进化的倾向
 */
let iota=1;

const JOBS={
    WARRIOR:{code:iota++,name:"WARRIOR"},
    ASSASSIN:{code:iota++,name:"ASSASSIN"},
    MAGE:{code:iota++,name:"MAGE"},
    PRIEST:{code:iota++,name:"PRIEST"},
    WARLOCK:{code:iota++,name:"WARLOCK"},
    KNIGHT:{code:iota++,name:"KNIGHT"},
}

module.exports.getJob=function (jobCode) {
    for(var k in JOBS){
        if(JOBS[k].code===jobCode){
            return JOBS[k];
        }
    }
}
