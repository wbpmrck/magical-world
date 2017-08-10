/**
 * Created by kaicui on 17/8/10.
 * 定义等级策略
 *
 * small:代表数值偏小化的等级经验值划分策略
 * 01：传统网游的曲线，越到后面越难
 */

const increase = require("../../math/increase");

const linear = increase.linear;

//((等级-1)^3+60)/5*((等级-1)*2+60)
var levelTable=[
    {from:1,to:10,fn:(levelToGo)=>{return  parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
    {from:11,to:20,fn:(levelToGo)=>{return  parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
    {from:21,to:30,fn:(levelToGo)=>{return  parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
    {from:31,to:40,fn:(levelToGo)=>{return  parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
    {from:41,to:50,fn:(levelToGo)=>{return  parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
    {from:51,to:60,fn:(levelToGo)=>{return  parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
    {from:61,to:70,fn:(levelToGo)=>{return  parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
    {from:71,to:80,fn:(levelToGo)=>{return  parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
    {from:81,to:90,fn:(levelToGo)=>{return  parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
    {from:91,to:100,fn:(levelToGo)=>{return parseInt( (Math.pow( (levelToGo-1),3)+60)/5*((levelToGo-1)*2+60)) }},
];

module.exports = levelTable;