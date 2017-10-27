/**
 * Created by kaicui on 17/8/22.
 * 定义英雄职业
 * 1、英雄一个时刻只能属于一个职业
 * 2、不同职业对技能、属性具有一些影响、和进化的倾向
 */
let iota=1;

const JOBS={
    WARRIOR:{code:iota++,name:"WARRIOR"}, //战士
    ASSASSIN:{code:iota++,name:"ASSASSIN"}, //刺客
    MAGE:{code:iota++,name:"MAGE"}, //法师
    PRIEST:{code:iota++,name:"PRIEST"}, //牧师
    WARLOCK:{code:iota++,name:"WARLOCK"}, //术士
    KNIGHT:{code:iota++,name:"KNIGHT"}, //骑士
}

module.exports= {
    JOBS,
    getJob:function (jobCode) {
        for (var k in JOBS) {
            if (JOBS[k].code === jobCode) {
                return JOBS[k];
            }
        }
    }
}
