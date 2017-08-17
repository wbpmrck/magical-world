/**
 * Created by kaicui on 17/8/7.
 */




const oop = require("local-libs").oop;
const event = require("local-libs").event;
const IntegerValue = require("../value/integer");
const EffectEvents =  {
    INSTALLED:1,
    UNINSTALLED:2,
};

var Effect = oop.defineClass({
    
    constructor:function({name,desc,level,params}){
        var self = this;
        event.mixin(self);
        
        self.name = name;
        self.desc = desc;
    
        //这里的level应该是一个 integerValue,方便以后对effect等级进行修正.
        if(! (level instanceof IntegerValue) ){
            throw new Error(`param level must be instance of IntegerValue!`)
        }
        
        self.level = level;
        self.level.on("change",function (raw,modify,total,val) {
            self.onLevelChange(total);
        });
        
        self.params = params; //由外部上下文来注入，效果的具体参数。这个参数由具体的效果自己来定义

        self.source = self.target = undefined; //效果的作用源、作用对象
        
        
    },
    prototype:{
    
        /**
         * 当等级变化的时候会触发，子类应该重写这个方法
         * @param nowLevel
         */
        onLevelChange:function (nowLevel) {
            
        },
        /**
         * 效果被放到目标对象
         * @param source：效果来源
         * @param target：放置对象
         * @returns {Effect}
         */
        onInstall:function (source,target) {
            this.source = source;
            this.target = target;
            
            // this.emit(EffectEvents.INSTALLED,this); //发射事件，通知外部
            return this;
        },
        /**
         * 效果从对象上移除了
         * @returns {Effect}
         */
        onUninstall:function () {
            this.source = this.target = undefined;
            
            // this.emit(EffectEvents.UNINSTALLED,this); //发射事件，通知外部
            return this;
        },
        toString:function(){
            return `level[${this.level.total()}][${this.name}][${this.desc}]`;
        }
    }
});

let getEffect=function (effectName,effectDesc,level, params) {
    let cons = require(`./implement/${effectName}`);
    let ef = new cons({
        name:effectName,
        desc:effectDesc,
        level:level,
        params:params
    });
    return ef;
}
module.exports = {Effect,EffectEvents,getEffect};
