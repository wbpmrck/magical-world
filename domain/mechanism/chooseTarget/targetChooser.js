/**
 * Created by kaicui on 17/8/17.
 * 所有chooser的基类
 *
 * todo:其实并没有存在的必要性，只是因为js没有接口的功能，所以用一个没有实现的基类，来做占位
 */



const oop = require("local-libs").oop;

let ChooserBase = oop.defineClass({
    super:undefined,
    constructor:function(){
        var self = this;
    },
    prototype:{
        /**
         * 选择目标对象
         * @param source：一个选择的发起者，可能是世界，也可能是某个角色
         * @param context：上下文，用于协助选择对象
         * @param params：对象选择器需要的参数
         * @return :返回应该是一个数组，数组元素是很多的角色对象
         */
        chooseTarget:function (source,context,params) {
            throw new Error("not implement")
        }    
    }
});

let getChooser = function (name) {
    let cons= require(`./implement/${name}`)
    let obj = new cons();
    return obj;
}

module.exports={ChooserBase,getChooser};