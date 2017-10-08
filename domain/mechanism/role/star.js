/**
 * Created by kaicui on 17/8/22.
 * 定义星级系统
 * 1、星级系统定义了星级之间的关系，需要的素材
 * 2、星级系统定义对属性的额外加成
 */


const oop = require("local-libs").oop;
const event = require("local-libs").event;

const MAX_LEVEL=5; //目前最多5星

var Star = oop.defineClass({
    super:undefined,
    constructor:function(starLevel){
        var self = this;
        
        self.level = starLevel;
    
        event.mixin(self);
        
    },
    prototype:{
        /**
         * 等级提升1
         * @returns {boolean}:是否成功提升。true表示成功
         */
       levelUp:function () {
           var self = this;
           if(self.level<MAX_LEVEL){
               self.emit("beforeUp",self.level,self.level+1);
               self.level = self.level+1;
               return true;
           }else{
               return false;
           }
       }
    }
});

module.exports={Star}