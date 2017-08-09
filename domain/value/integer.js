/**
 * Created by kaicui on 17/8/5.
 * 表示最基础的数值类型(整数）
 *
 * value的修改操作一般分2种：
 *
 * update:[修改]-直接修改raw值,一般使用与hp,mp等这些状态变化的地方
 * modify:[修正]-通过附加modifier,改变外部读取value的时候拿到的数据，raw并没改变。一般使用于：attack,defense等这种属性类场景
 *
 * -----------2017年08月09日----------
 * 新增 特性：
 * addModifier 的输入，可以不再是简单值，而是可以是另外一个Integer
 * 这样的话，如果modify本身是一个可变的值，那么这个变化会一直传递下去
 *
 * 本版本，addModifier 会兼容老的写法（纯值）和新的写法（Integer）
 * 注意：
 *  1、当传入的是Integer对象的时候，对于：addPercent:会当做千分位的分子处理，比如 100代表 100/1000=1/10
 *
 * -----------2017年08月08日----------
 * 新增 option:min,max（可选参数）
 *      -   控制raw的取值范围
 *      -   只对raw有效，对modify无效（数据的修正可以超出raw的限制，或者说和raw无关）
 */

const oop = require("local-libs").oop;
const event = require("local-libs").event;

var IntegerValue = oop.defineClass({
    constructor:function(rawValue,{min,max}={}){
        
        
        var self = this;
        event.mixin(self);
    
        self.options={min,max}; //可选项：最小值，最大值，用于控制raw的范围,可以不传
        
        rawValue = parseInt(rawValue);
        
        let checkResult = self.checkRawIllegal(rawValue);
        if(checkResult==-1){
            rawValue = min;
            // throw new Error(`value:[${rawValue}] create error,must between [${min}] and [${max}]!`)
        }else if(checkResult==1){
            rawValue = max;
            // throw new Error(`value:[${rawValue}] create error,must between [${min}] and [${max}]!`)
        }
        self.raw = rawValue;
        
        self.modify = 0;
        
        if(min !== undefined && max!== undefined){
            if(min>max){
                throw new Error(`value:[${rawValue}] create error,min must smaller than max!`)
            }
        }
    
        //多个对该值的修正项。每一项都一定含一个ref字段，addVal和addPercent一般来说只存在一个
        self.modifier =[/*{ref:<object>,addVal:-20},{ref:<object>,addPercent:0.05}*/];
        
        self._fn={
            "refreshModify":self.refreshModify.bind(self)
        }
        
    },
    prototype:{
        /**
         * 改变value的取值范围（会对当前raw值进行修正）
         * @param min
         * @param max
         */
        changeRawRange:function ({min,max}={}) {
            this.options={min,max};
            
            let checkResult = this.checkRawIllegal(this.raw);
            if(checkResult==-1){
                this.setRaw(min);
            }else if(checkResult==1){
                this.setRaw(max);
            }
        },
        checkRawIllegal:function (raw) {
            if(this.options){
                if(this.options.min!==undefined){
                    if(raw<parseInt(this.options.min) ){
                        return -1; //表示达到下限
                    }
                }
                if(this.options.max!==undefined){
                    if(raw>parseInt(this.options.max) ){
                        return 1; //表示达到上限
                    }
                }
            }
            return 0;
        },
        /**
         * 计算value的本身值+修正值的和
         * @returns {Number}
         */
        total:function () {
          return parseInt(this.raw+this.modify);
        },
        /**
         * 触发change事件到外部，参数:raw,modify,this
         */
        notifyChage:function () {
            this.emit("change",this.raw,this.modify,this.total(),this);
        },
        /**
         * 重设raw值
         * @param raw
         */
        setRaw:function (raw) {
            raw = parseInt(raw);
    
            let checkResult = this.checkRawIllegal(raw);
            if(checkResult==-1){
                raw = this.options.min;
                // throw new Error(`value:[${rawValue}] create error,must between [${min}] and [${max}]!`)
            }else if(checkResult==1){
                raw = this.options.max;
                // throw new Error(`value:[${rawValue}] create error,must between [${min}] and [${max}]!`)
            }
            
            // if(!this.checkRawLegal(raw)){
            //     throw new Error(`setRaw ${raw} error,must between [${this.options.min}] and [${this.options.max}]!`);
            // }
            
            let old = this.raw;
            if(old != raw){
                this.raw = raw;
                this.refreshModify(); //raw 改变了，也需要重新计算modify
            }
        },
    
        /**
         * value 根据自己被修正的情况，重新更新modify的值
         */
        refreshModify:function () {
            var self = this;
            self.modify=0; //init
            
            self.modifier.forEach((modifyObject)=>{
                // console.log("modifyObject="+JSON.stringify(modifyObject));
               if(modifyObject.addVal!==undefined){
                   
                   //如果是Integer
                   if(modifyObject.addVal instanceof IntegerValue){
                       self.modify += modifyObject.addVal.total();
                   }else{
                       self.modify += parseInt(modifyObject.addVal);
                   }
               }
                if(modifyObject.addPercent!==undefined){
    
                    //如果是Integer
                    if(modifyObject.addPercent instanceof IntegerValue){
                        self.modify += parseInt(self.raw * (modifyObject.addPercent.total()/1000));
                    }else{
                        self.modify += parseInt(self.raw * modifyObject.addPercent);
                    }
                }
            });
            
            this.notifyChage();//通知外部change
        },
    
        /**
         * 添加一个修正对象
         * @param ref:触发该值修正的对象引用
         * @param addVal:修正的值
         * @param addPercent:修正的百分比（基于raw)
         */
        addModifier : function(ref,{addVal,addPercent}){
            var self = this;
            //必须传入ref,addVal和addPercent至少传入1个
            if(ref!==undefined && (addVal!==undefined || addPercent!==undefined)){
                this.modifier.push({ref,addVal,addPercent});
                this.refreshModify();
                
                //判断类型,如果修正值本身，又是一个Integer(可变化),那么需要订阅其变化:
                if(addVal instanceof IntegerValue){
                    addVal.on("change",self._fn.refreshModify);
                }
                if(addPercent instanceof IntegerValue){
                    addPercent.on("change",self._fn.refreshModify);
                }
            }
        },
        /**
         * 移除修正对象对该value的影响
         * @param ref
         */
        removeModifier : function(ref){
            if(this.modifier && this.modifier.length){
                for(var i=0,j=this.modifier.length;i<j;i++){
                    var item = this.modifier[i];
                    if(item.ref === ref){
                        this.modifier.splice(i,1);
                        this.refreshModify();
                        break;
                    }
                }
            }
        }
        
        
    }
});

module.exports = IntegerValue;
