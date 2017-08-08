/**
 * Created by kaicui on 17/8/7.
 */




const oop = require("local-libs").oop;
const event = require("local-libs").event;
const IntegerValue = require("../value/integer");

var Effect = oop.defineClass({
    
    constructor:function({name,desc,levelMax,level,params}){
        var self = this;
        event.mixin(self);
        
        self.name = name;
        self.desc = desc;
    
        //这里的level应该是一个 integerValue,方便以后对effect等级进行修正
        if(! (levelMax instanceof IntegerValue && level instanceof IntegerValue) ){
            throw new Error(`param levelMax/level must be instance of IntegerValue!`)
        }
        
        self.levelMax = levelMax; //level
        self.level = level;
        self.params = params; //由外部上下文来注入，效果的具体参数。这个参数由具体的效果自己来定义

        self.source = self.target = undefined; //效果的作用源、作用对象
        
        
    },
    prototype:{
    
        /**
         * 增加效果等级
         * @param count：增加量，默认=1
         */
        levelUp:function (count=1) {
            let to = this.level.raw+count;
            if(to>this.levelMax){
                to = this.levelMax;
            }
            this.level.setRaw(to<1?1:to);
        },
        /**
         * 减少效果等级
         * @param count：增加量，默认=1
         */
        levelDown:function (count=1) {
            let to = this.level.raw-count;
            if(to>this.levelMax){
                to = this.levelMax;
            }
            this.level.setRaw(to<1?1:to);
        },
        toString:function(){
            return `${this.name}[${this.desc}]`;
        }
    }
});

module.exports = Effect;
