/**
 * Created by kaicui on 17/8/13.
 * 世界生命周期定义
 */

let iota=1000;
let WordLifeCycle={
    AFTER_WORLD_OPEN:iota++,
    BATTLE_BEGIN:iota++,
    TURN_BEGIN:iota++,
    BEFORE_CHAR_ACTION:iota++,
    BEFORE_CHAR_NORMAL_ATK:iota++,
    BEFORE_CHAR_BE_NORMAL_ATKED:iota++,
    AFTER_CHAR_BE_NORMAL_ATKED:iota++,
    AFTER_CHAR_NORMAL_ATK:iota++,
    AFTER_CHAR_BE_NORMAL_ATK_MISS:iota++,
    AFTER_CHAR_NORMAL_ATK_MISS:iota++,
    AFTER_CHAR_ACTION:iota++,
    TURN_END:iota++,
    BATTLE_END:iota++,
    BEFORE_WORLD_CLOSE:iota++,
};
let CharLifeCycle={
    BEFORE_CHAR_ACTION:iota++,
    BEFORE_CHAR_NORMAL_ATK:iota++,
    BEFORE_CHAR_BE_NORMAL_ATKED:iota++,
    AFTER_CHAR_BE_NORMAL_ATKED:iota++,
    AFTER_CHAR_NORMAL_ATK:iota++,
    AFTER_CHAR_BE_NORMAL_ATK_MISS:iota++,
    AFTER_CHAR_NORMAL_ATK_MISS:iota++,
    AFTER_CHAR_ACTION:iota++,
};

module.exports={WordLifeCycle,CharLifeCycle}



