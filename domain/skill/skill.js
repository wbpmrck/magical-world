/**
 * Created by kaicui on 17/8/7.
 */




const oop = require("local-libs").oop;
const event = require("local-libs").event;
const IntegerValue = require("../value/integer");

var Skill = oop.defineClass({
    
    constructor:function({name,desc,levelMax,level,params}){
        var self = this;
        event.mixin(self);
        
        self.name = name;
        self.desc = desc;
    
        
    },
    prototype:{
    
    }
});

module.exports = Skill;
