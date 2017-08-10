/**
 * Created by kaicui on 17/8/10.
 *
 * 表示一个可以进行升级的对象.
 *
 * 功能：
 * 1、可以设定初始level,level上限(都可以是Integer,可以被修正，且修正后会触发Level的正常工作)
 * 2、可以设定level经验累积，达到特定级别的数值曲线函数
 * 3、提供增加经验、增加等级等方法，方便的修改持有者的经验、等级
 */

const oop = require("local-libs").oop;
const event = require("local-libs").event;
oop.defineClass({
    super:undefined,
    constructor:function({
        levelCur, //number,或者Integer 对象，表示当前等级
        levelMax, //number,或者Integer 对象，表示最高等级
        
    }){
        var self = this;
    
        event.mixin(self);
        
        
    },
    prototype:{
    
    }
});