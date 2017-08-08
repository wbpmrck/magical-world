/**
 * Created by kaicui on 17/8/7.
 */




const oop = require("local-libs").oop;
const event = require("local-libs").event;
const IntegerValue = require("../value/integer");
const {events} = require("./consts");

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
        
        self.params = params; //由外部上下文来注入，效果的具体参数。这个参数由具体的效果自己来定义

        self.source = self.target = undefined; //效果的作用源、作用对象
    },
    prototype:{
    
        onInstall:function (source,target) {
            this.source = source;
            this.target = target;
            
            this.emit(events.INSTALLED,this); //发射事件，通知外部
            return this;
        },
        onUnstall:function () {
            this.source = this.target = undefined;
            
            this.emit(events.UNINSTALLED,this); //发射事件，通知外部
            return this;
        },
        toString:function(){
            return `level[${this.level.total()}][${this.name}][${this.desc}]`;
        }
    }
});

module.exports = Effect;
