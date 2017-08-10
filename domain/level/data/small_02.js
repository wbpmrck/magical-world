/**
 * Created by kaicui on 17/8/10.
 * 定义等级策略
 *
 * small:代表数值偏小化的等级经验值划分策略
 * 02：简单的线性关系
 */

const increase = require("../../math/increase");

const linear = increase.linear;

var levelTable=[
    {from:1,to:10,fn:(levelToGo)=>{return 10+linear(levelToGo,20)}},
    {from:11,to:20,fn:(levelToGo)=>{return 20+linear(levelToGo,40)}},
    {from:21,to:40,fn:(levelToGo)=>{return 100*levelToGo+linear(levelToGo,126)}},
    {from:41,to:60,fn:(levelToGo)=>{return 200*levelToGo+linear(levelToGo,220)}},
    {from:61,to:80,fn:(levelToGo)=>{return 400*levelToGo+linear(levelToGo,320)}},
    {from:81,to:90,fn:(levelToGo)=>{return 800*levelToGo+linear(levelToGo,520)}},
    {from:91,to:100,fn:(levelToGo)=>{return 1800*levelToGo+linear(levelToGo,4920)}},
];

module.exports = levelTable;