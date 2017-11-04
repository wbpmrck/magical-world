
/*
    表示一个英雄的显示单位
    
    2017年11月03日：
    目前就是一个方块：
        右侧2个长条形，蓝色表示SP/SP_MAX,红色表示HP,HP_MAX
        使用动画来展示数值的变化：
            1）开始行动：方块边框闪烁
            2）收到伤害：数字跳动
                普通伤害
                暴击伤害
            3）收到效果加成：效果图标浮在边框
            4）收到效果移除：效果图标移除
 */
const oop = require("../../js/oop");
const evt = require("../../js/event");
const Vue = require("../../js/vue");

let Hero = oop.defineClass({
    super:undefined,
    constructor:function({
                             parent,
                             seq,
                             id,
                             name,
                             star,
                             level,
                             attrMap,//属性集合
                         }){
    
        var self = this;

        self.vm = new Vue({
            data: {
                parent,
                seq,
                id,
                name,
                star,
                level,
                attrMap,//属性集合
                effects:[]// 当前具有的效果集合
            },
            watch:{
                attrMap:function (newAttr) {
                
                }
            }
        });
        
        self.vm.attrMap['HP'] = self.vm.attrMap['HP_MAX'];
        self.vm.attrMap['SP'] = 0;
    
        // self.parent = parent;
        // self.seq = seq;
        // self.id = id;
        // self.name = name;
        // self.star = star;
        // self.level = level;
        // self.attrMap = attrMap;
    
    
        //ui基本参数
        let shape = self.shape ={
            left: parent.shape.left+10,
            top: parent.shape.top+120*seq,
            width:100,
            height:100,
            padding:5, //内容边距
        };
        self.uiElement ={
            status:new fabric.Text(self.getStatusText(),{
                fontSize:18,
                left:shape.left + shape.padding+ shape.width/2-10,
                top:shape.top + shape.padding
            }),
            // level:new fabric.Text(`(${self.vm.level.toString()})`,{
            //     fontSize:18,
            //     left:shape.left + shape.padding+ shape.width/2-30,
            //     top:shape.top + shape.padding
            // }),
            effects:new fabric.Text(self.vm.effects.join(","),{
                fontSize:12,
                left:shape.left + shape.padding+ 3,
                top:shape.top + shape.padding +25
            }),
            // star:new fabric.Text(self.vm.star.toString(),{}),
            // hp:new fabric.Rect({
            //     fill: 'red',
            //     left: parent.startPos.left+10,
            //     top: parent.startPos.top+120*seq,
            //     width: 100,
            //     height: 100
            // }),
            // sp:new fabric.Rect({
            //     fill: 'blue',
            //     left: parent.startPos.left+10,
            //     top: parent.startPos.top+120*seq,
            //     width: 100,
            //     height: 100
            // }),
        };
        
        // self.uiElement = new fabric.Rect({
        //     fill: 'red',
        //     left: parent.startPos.left+10,
        //     top: parent.startPos.top+120*seq,
        //     width: 100,
        //     height: 100
        // });
    },
    prototype:{
        getStatusText:function () {
          var self = this;
          return `(lvl:${self.vm.level})${self.vm.name}[${self.vm.attrMap["HP"]}/${self.vm.attrMap["HP_MAX"]}][${self.vm.attrMap["SP"]}/${self.vm.attrMap["SP_MAX"]}]`
        },
        acceptAttrChange:function ({attr,attrChanged}) {
            var self = this;
            
            self.vm.attrMap[attr]+=attrChanged;
            self.uiElement.status.set("text",self.getStatusText());
        },
        getUIElements:function () {
            var self = this;
            
            let result =[];
            for(var k in self.uiElement){
                result.push(self.uiElement[k]);
            }
            return result;
        }
    }
});
module.exports ={Hero};