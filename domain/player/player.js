/**
 * Created by kaicui on 17/8/22.
 * 玩家
 * 1、1个玩家账户，在后台内存里一个时刻只存在一个player实例
 * 2、通过player实例，可以监听到这个玩家发生的所有事件
 */
const oop = require("local-libs").oop;
const event = require("local-libs").event;
const logger = require("../../log/logger");
const {delegateEvent} = require("../util/event");
var Player = oop.defineClass({
    super:undefined,
    constructor:function({
        id,
        account, //登录名
        name, //昵称
        avatar, //头像
        vipLevel, //vip等级，默认0，不是vip
    }){
        var self = this;
        event.mixin(self);
        
        self.id = id;
        self.account = account;
        self.name = name;
        self.avatat = avatar;
        self.vipLevel = vipLevel;
        
    },
    prototype:{
        toString:function () {
            var self = this;
            return `玩家[${self.id}][${self.name}]`;
        },
        /**
         * 关注玩家下面的一个游戏对象，监听游戏对象发出的事件，并转发
         * @param object
         */
        watch:function (object) {
            delegateEvent(object,this);
        }
    }
});

module.exports= {
    Player
}
