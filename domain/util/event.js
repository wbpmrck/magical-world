/**
 * Created by kaicui on 17/10/30.
 */

/**
 * 将source上发射的事件，全部在proxy上发射一次，增加第一个参数，是source
 *
 * 比如，原来是  battle.emit("event",p1,p2)  则battle被Player代理之后，player上可以通过  player.on("event",(battle,p1,p2))来观察
 * @param source
 * @param proxy
 */
var delegateCache ={}; //key:'proxy_'+proxy.id+'source'+_source.id   value:slotId
function delegateEvent(source, proxy) {
    if(source && source.on){
        delegateCache['proxy_'+proxy.id+'source_'+source.id]=source.on("*",function () {
            let that = this;
            let args = [].slice.call(arguments);
            args.unshift(undefined);
            
            //原来的第一个参数是事件名称，在这个参数之后，增加source对象
            args[0]=args[1];
            args[1] = source;
            proxy.emit.apply(proxy,args);
        })
    }
}
function unDelegateEvent(source, proxy) {
    if(source && source.off){
        source.off("*",delegateCache['proxy_'+proxy.id+'source_'+source.id]);
    }
}

module.exports={delegateEvent,unDelegateEvent};
