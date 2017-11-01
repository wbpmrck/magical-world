/**
 * Created by kaicui on 17/10/27.
 */
const path = require("path");
const glob = require("glob");
const logger = require("../../log/logger");

var globalInstancesConfig={}; //存储构造实例的配置项
var globalInstancesCache={}; //存储全局singleton对象缓存
var globalSeed = Math.floor( ( (+new Date()) / 1000 ) )*10000;

//启动时读取 ./instances 目录下所有的instances，注册到自己的字典里
glob(path.join(__dirname,"./instances/*.js"), {}, function (er, files) {
    
    for(let file of files){
        logger.debug(`--->正在 读取instances:from[${file}]`);
        let instances = require(file).instances;
      
        for(var i=0,j=instances.length;i<j;i++){
            var item = instances[i];
            logger.debug(`--->加载instance配置[${item.key}]`);
            globalInstancesConfig[item.key] = item;
        }
        logger.debug(`--->完成 加载instances[${i}]个,from:[${file}]`);
    }
    logger.debug('=====读取instances 完毕======');
});

function objectFactory(constructor,paramArray) {
    
    var obj = new Object();//从Object.prototype上克隆一个对象
        
    
    var F=function(){};
    F.prototype= constructor.prototype;
    obj=new F();//指向正确的原型
    
    var ret = constructor.apply(obj, paramArray);//借用外部传入的构造器给obj设置属性
    
    return typeof ret === 'object' ? ret : obj;//确保构造器总是返回一个对象
    
};

var make=function ({
    key,//要创建的实例名称（全局唯一)
}) {
    
    //读取全局字典，获取构造函数、参数，创建对象
    let instanceConf = globalInstancesConfig[key];
    
    if(instanceConf){
        
        //先检查，全局缓存里有没有这个key的实例缓存，有的话直接返回
        if(globalInstancesCache[key]){
            return globalInstancesCache[key];
        }else{
            //没有的话，开始制造对象
            
            //通过先序列化再反序列化的方式，隔断params和instanceConf的引用关系
            let params = JSON.parse(JSON.stringify(instanceConf.params));
            
            //注意解析参数的类型，如果是ref类型，则需要递归调用make
            function fillParam(param) {
                
                //如果参数是一个数组，则对内部每一个项目进行参数填充
                if(param.constructor.name === 'Array'){
                    param.forEach(function (p,index) {
                        param[index]=fillParam(p); //重新更新数组对象引用
                    })
                }
                //param是对象
                else if(typeof param ==='object'){
    
                    //如果参数是一个ref引用，则填充引用
                    if(param.t==='ref'){
                        param = make({
                            key:param.key
                        })
                    }else if(param.t==='seed'){
                        param = globalSeed++;
                    }else{
                        //否则对对象的每一个属性进行填充
                        for(let p in param){
                            param[p] = fillParam(param[p]);
                        }
                    }
                }
                
                return param;
            }
            
            //先把参数中的ref注入
            fillParam(params);
            
            //开始构造
            return objectFactory(instanceConf.constructor,params);
        }
    }
    else{
        throw new Error(`no such instance key:${key}`);
    }
};

/**
 * 创建一个占位meta,表示这个值将来用一个指向key的对象替代
 * @param key
 * @returns {{t: string, key: *}}
 */
var ref=function ({
    key,//要引用的实例名称（全局唯一）
}) {
    return {t:"ref",key:key};
};

/**
 * 创建一个占位meta,表示这个值将来用一个全局子增长种子替代
 * @returns {{t: string}}
 */
var seed = function () {
  return {t:"seed"}
};

//todo:可以扩充更多的辅助创建数据的方法，比如random(min,max)之类的，方便灵活生成各种不同的对象
module.exports={
    make,ref,seed
}
