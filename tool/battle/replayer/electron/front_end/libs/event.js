
;(function (global) {
    
    var __pub__={};
    var slotSeed= 1,
        _slice = Array.prototype.slice,
        ALL_TOKEN='*';
    
    
    function EventEmitter(){};
    EventEmitter.prototype	= {
        once: function(evtName, cb){
            return this.on(evtName,cb,1);
        },
        /**
         *
         * 订阅事件
         * @param evtName：事件名
         * @param cb：回调函数
         * @param ttl:可选参数，默认没有ttl限制，必须>0
         * @returns {number}:返回事件槽号,可以唯一标识一个事件回调函数
         */
        on	: function(evtName, cb,/*optional*/ttl){
            this._events = this._events || {};
            this._events[evtName] = this._events[evtName]	|| [];
            cb&&this._events[evtName].push(cb);
            
            cb&&(cb._slotId=slotSeed)&&ttl&&ttl>0&&(cb._ttl=ttl);
            return slotSeed++;
        },
        
        /**
         * 取消事件订阅
         * @param evtName:要取消订阅的事件
         * @param cb：要取消订阅的SubscribeId或回调函数
         * @returns {EventEmitter}
         */
        off	: function(evtName, cb){
            this._events = this._events || {};
            if( evtName in this._events === false  )	return;
            
            var t = typeof cb;
            if(t=="number"){
                for(var i=this._events[evtName].length-1;i>=0;i--){
                    var _item = this._events[evtName][i];
                    if(_item._slotId == cb){
                        this._events[evtName].splice(i, 1);
                        break;
                    }
                }
            }else if( (t=="string" && cb.toLowerCase()=="all") ||(t=="undefined")){
                delete this._events[evtName];
            }else if(t=="function"){
                
                for(var i=this._events[evtName].length-1;i>=0;i--){
                    var _item = this._events[evtName][i];
                    if(_item.toString() === cb.toString()){
                        //本来想用函数上保存的slotId来标识，但是很可能函数是反复创建的函数对象
                        //if(_item._slotId === cb._slotId){
                        this._events[evtName].splice(i, 1);
                        break;
                    }
                }
            }else{
                throw new Error("second param must be number/function/string")
            }
            return this;
        },
        /**
         * 主动发射事件+参数
         * @param evtName：事件名
         * @param args:可变的参数比如:emit("foo",1,2,3),那么on("foo",function(a,b,c){这里面a=1,b=2,c=3})
         */
        emit	: function(evtName /* , args... */){
            this._events = this._events || {};
            var cb,
                cut=false;//由于是正向遍历，且遍历过程中可能删除回调数组元素，所以需要标记是否删除，来控制for循环
            
            function _dispatch(subEvtName){
                var _args = _slice.call(arguments, 1);
                for(var i = 0, j=this._events[subEvtName].length; i<j;(cut&&j--) || i++){
                    cut = false;
                    (cb=this._events[subEvtName][i])&&(cb.apply(this, _args));
                    //do with TTL
                    cb && Object.prototype.hasOwnProperty.call(cb,"_ttl") && (--cb._ttl<=0) && (cut = true) &&  this._events[subEvtName].splice(i, 1);
                }
            }
            
            //如果 要发射的事件名称被订阅过，并且该事件并非“*”事件，则开始发射（避免 on("*")触发2次）
            if( evtName in this._events && evtName !==ALL_TOKEN){
                _dispatch.apply(this,_slice.call(arguments));
            }
            //无论什么事件都触发 on("*")
            if( ALL_TOKEN in this._events ){
                _dispatch.apply(this,[ALL_TOKEN].concat(_slice.call(arguments)));
            }
            return this;
        },
        /**
         * 以管道的方式派发事件+参数
         * 这种模式下，事件处理函数会多一个末位参数 next,可以通过调用next通知下一个注册的处理函数开始执行
         * next函数如果带参数，则下一个处理函数收到的是修改后的参数。
         * next函数如果不带参数，则下一个处理函数收到的是pipe发出的初始参数
         * pipe模式也支持ttl功能，中间某一个处理函数一旦达到ttl，就会被从调用链条里移除
         * @param evtName：事件名
         * @param args:可变的参数比如:emit("foo",1,2,3),那么on("foo",function(a,b,c){这里面a=1,b=2,c=3})
         */
        pipe	: function(evtName /* , args... */){
            var self = this;//save the this ref
            
            self._events = self._events || {};
            var cur,
                cut=false;//由于是正向遍历，且遍历过程中可能删除回调数组元素，所以需要标记是否删除，来控制for循环
            
            function _dispatch(subEvtName){
                var _args = _slice.call(arguments, 1,arguments.length-1),
                    over = arguments[arguments.length-1],
                    _iteratorArgs;
                var i= 0,j=self._events.hasOwnProperty(subEvtName)?self._events[subEvtName].length:0;
                
                function _next(){
                    cur && Object.prototype.hasOwnProperty.call(cur,"_ttl") && (--cur._ttl<=0) && (cut = true) &&  self._events[subEvtName].splice(i, 1);
                    (cut&&j--) || i++
                    _iterator.apply(self,_slice.call(arguments));
                }
                function _iterator(){
                    _iteratorArgs = _slice.call(arguments);
                    cut = false;
                    if(i < j){
                        //todo:pipe消息
                        _cur = self._events[subEvtName][i];
                        if(_iteratorArgs.length===0){
                            _iteratorArgs = _slice.call(_args);
                        } //if not modify params,use the origin params
                        
                        
                        //add next arg for pipe to next
                        _iteratorArgs.push(_next);
                        
                        //add evtName param to * handler
                        //subEvtName === ALL_TOKEN && _iteratorArgs.unshift(ALL_TOKEN)
                        _cur.apply(self,_iteratorArgs);
                    }else{
                        //对evt的调用结束
                        over && over(_iteratorArgs);
                    }
                }
                _iterator();//start the iterator calling.
                
                //for(var i = 0, j=this._events[subEvtName].length; i<j;(cut&&j--) || i++){
                //    cut = false;
                //    (cb=this._events[subEvtName][i])&&(cb.apply(this, _args));
                //    //do with TTL
                //    cb && Object.prototype.hasOwnProperty.call(cb,"_ttl") && (--cb._ttl<=0) && (cut = true) &&  this._events[subEvtName].splice(i, 1);
                //}
            }
            
            var _originArgs=  evtName === ALL_TOKEN?[ALL_TOKEN].concat(_slice.call(arguments)):_slice.call(arguments);
            
            //如果 要发射的事件名称被订阅过，并且该事件并非“*”事件，则开始发射（避免 on("*")触发2次）
            //if( evtName in self._events && evtName !==ALL_TOKEN){
            _dispatch.apply(self,_originArgs.concat([function (_iteratorArgs) {
                //如果pipe("*"),则前面已经处理过了
                if(evtName !==ALL_TOKEN){
                    //获取最后一个处理函数的返回,如果没有，还用原始的参数
                    if(_iteratorArgs.length===0){
                        _iteratorArgs =_originArgs
                    }
                    else{
                        //如果内部返回的参数，那么要补上evtName
                        _iteratorArgs.unshift(evtName);
                    }
                    _iteratorArgs.push(null);//对于*事件处理，over回调不需要了
                    //无论什么事件都触发 on("*")
                    if( ALL_TOKEN in self._events ){
                        _dispatch.apply(self,[ALL_TOKEN].concat(_iteratorArgs));
                    }
                }
            }]));
            return self;
        }
    };
    __pub__.EventEmitter	= EventEmitter;
    __pub__.mixin	= function(destObject){
        var props	= ['on','once', 'off', 'emit','pipe'];
        for(var i = 0; i < props.length; i ++){
            if( typeof destObject === 'function' ){
                destObject.prototype[props[i]]	= EventEmitter.prototype[props[i]];
            }else{
                destObject[props[i]] = EventEmitter.prototype[props[i]];
            }
        }
    }
    
    //amd loader
    if("function"==typeof define&&define.amd){
        define([],function(){"use strict";return __pub__});
    }
    //commonjs loader
    else if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = __pub__;
    }
    //oneLib.CMDSyntax loader
    else if("function"==typeof define&&define.oneLib){
        define("OneLib.EventEmitter",function(){return __pub__});
    }
    //no module loader
    global['OneLib'] || (global['OneLib']={});
    global['OneLib'].EventEmitter = __pub__;
})(this);