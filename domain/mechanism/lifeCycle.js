/**
 * Created by kaicui on 17/8/13.
 * 世界生命周期定义
 */

//2017年10月19日 ：改为从battle,hero里引用事件定义
//
// let iota=1000;
// let WordLifeCycle={
//     AFTER_WORLD_OPEN:iota++,
//     BATTLE_BEGIN:iota++,
//     TURN_BEGIN:iota++,
//     BEFORE_CHAR_ACTION:iota++,
//     BEFORE_CHAR_NORMAL_ATK:iota++,
//     BEFORE_CHAR_BE_NORMAL_ATKED:iota++,
//     AFTER_CHAR_BE_NORMAL_ATKED:iota++,
//     AFTER_CHAR_NORMAL_ATK:iota++,
//     AFTER_CHAR_BE_NORMAL_ATK_MISS:iota++,
//     AFTER_CHAR_NORMAL_ATK_MISS:iota++,
//     AFTER_CHAR_ACTION:iota++,
//     TURN_END:iota++,
//     BATTLE_END:iota++,
//     BEFORE_WORLD_CLOSE:iota++,
// };
// let CharLifeCycle={
//     BEFORE_CHAR_ACTION:iota++,
//     BEFORE_CHAR_NORMAL_ATK:iota++,
//     BEFORE_CHAR_BE_NORMAL_ATKED:iota++,
//     AFTER_CHAR_BE_NORMAL_ATKED:iota++,
//     AFTER_CHAR_NORMAL_ATK:iota++,
//     AFTER_CHAR_BE_NORMAL_ATK_MISS:iota++,
//     AFTER_CHAR_NORMAL_ATK_MISS:iota++,
//     AFTER_CHAR_ACTION:iota++,
// };
let iota=8000;


const BattleEvents={
    
    BATTLE_BEGIN:iota++,
    BATTLE_END:iota++,
    
    TURN_BEGIN:iota++,
    TURN_END:iota++,
};

const HeroEvents={
    
    BEFORE_ACTION:iota++,
    AFTER_ACTION:iota++,
    
    BEFORE_MUTATION:iota++,
    AFTER_MUTATION:iota++,
    
    BEFORE_HERO_DIE:iota++,
    AFTER_HERO_DIE:iota++,
    
    AFTER_HERO_FLEE:iota++, //闪避别人的进攻时 (进攻者,effect)
    AFTER_HERO_MISS:iota++, //攻击MISS的时候 (闪避者,effect)
};

let WordLifeCycle = Object.assign({},BattleEvents,HeroEvents);
// let CharLifeCycle = require("./role/hero").HeroEvents;

module.exports={WordLifeCycle,BattleEvents,HeroEvents}



