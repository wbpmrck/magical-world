/** 定义 mutation
 * Created by kaicui on 17/10/8.
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;

let Mutation = oop.defineClass({
    super:undefined,
    constructor:function({}){
        var self = this;
        event.mixin(self);
        
        
    },
    prototype:{
    
    }
});

module.exports={Mutation};