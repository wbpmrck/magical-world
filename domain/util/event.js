/**
 * Created by kaicui on 17/10/30.
 */

/**
 * 将source上发射的事件，全部在proxy上发射一次，增加第一个参数，是source
 * @param source
 * @param proxy
 */
function delegateEvent(source, proxy) {
    if(source && source.on){
        source.on("*",function () {
            let args = [].slice.call(arguments);
            args.unshift(source);
            proxy.emit.apply(proxy,args);
        })
    }
}

module.exports={delegateEvent};
