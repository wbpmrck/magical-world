/**
 * Created by kaicui on 17/8/20.
 *
 * 基础chooser实现。
 *
 * 选择对象：技能持有者自己
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const {ChooserBase} = require("../targetChooser");

let SelfChooser = oop.defineClass({
    super:ChooserBase,
    constructor:function(){
        var self = this;
    },
    prototype:{
        chooseTarget:function (source,context,lifeCycleParams,params) {
            return source; //返回发起者自身
        }
    }
});

module.exports = SelfChooser;