/**
 * Created by kaicui on 17/8/5.
 */


var _hasProp = Object.prototype.hasOwnProperty;
/**
 * 定义类
 * @param metaData:{constructor,prototype,super}
 * @param base
 * @private
 */
var F = function () {};//proxy object's constructor
function _defineClass(metaData){
    if(metaData === undefined) return undefined;
    if(_hasProp.call(metaData,"constructor")){
        var cons = metaData["constructor"],
            realCons=cons;
        //如果是继承，则添加中介对象
        if(_hasProp.call(metaData,"super")){
            var parentClass = metaData["super"];
            if(parentClass !== undefined){
                F.prototype = parentClass.prototype;
                realCons = function(){
                    parentClass.apply(this,[].slice.call(arguments));//call parent to initial instance properties
                    cons.apply(this,[].slice.call(arguments));//then call sub
                    return this;
                }
                
                realCons.prototype = new F();
                realCons.prototype.constructor = realCons;//设置constructor指向构造函数
                //add by kaicui 2015-02-10(保留基类的prototype,方便调用基类方法)
                realCons.__supperClassProto__ = parentClass.prototype;
            }
        }
        
        if(_hasProp.call(metaData,"prototype")){
            for(i in metaData["prototype"]){
                realCons.prototype[i] = metaData["prototype"][i]
            }
        }
        
        return realCons;
    }else{
        throw new Error("must have constructor!")
    }
}

module.exports= {
    defineClass:_defineClass,
    getSupper:function(classRef){
        
        if(typeof  classRef ==='function'){
            return classRef.__supperClassProto__ ;
        }
        if(typeof  classRef ==='object'){
            return classRef.constructor.__supperClassProto__ ;
        }
    }
}
