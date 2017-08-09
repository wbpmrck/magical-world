/**
 * Created by kaicui on 17/8/9.
 *
 * 这里提供各种单调递增的函数。
 *
 * 给定2个输入A,B(A<B)
 * 一定会得到输出A<输出B
 */

/**
 * 线性增长
 * @param input:输入
 * @param factor:输出乘数
 * @returns {number}
 */
var linear = function (input,factor=1) {
    return input*factor;
};

module.exports={linear}
