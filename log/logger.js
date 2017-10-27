/**
 * Created by kaicui on 16/11/16.
 * 提供不同环境下的日志记录功能
 *
 * 使用 NODE_DEBUG 环境变量来启动程序,看到不同等级的日志输出
 */

const util = require('util');


module.exports={
    // "debug":util.debuglog('debug'),
    "debug":function () {
        console.log.apply(this,arguments)
    },
    "info":util.debuglog('info'),
    "error":util.debuglog('error')
}

