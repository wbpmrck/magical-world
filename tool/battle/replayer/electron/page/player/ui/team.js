/*
    表示一个队伍的UI展示
    
    1、攻击方在左侧，里面的英雄从上到下竖直排列
    2、防守方在右侧，....
 */
const oop = require("../../js/oop");
const evt = require("../../js/event");
const {Hero} = require("./hero");

let Team = oop.defineClass({
    super:undefined,
    constructor:function({
                             id,
                             role,
                             player,//{id: 15095894100001, name: "weatherpop", avatar: ""}
                             heros,//[{"id":15095894100002,"name":"光战1","camp":{"race":{"code":1,"camp":{"code":1,"name":"JUSTICE"},"name":"LIGHT"}},"job":{"code":1,"name":"WARRIOR"},"star":1,"attrMap":{"HP":57,"HP_MAX":146,"SP":0,"SP_MAX":50}}]
                         }){
    
        var self = this;
        evt.mixin(self);
        
        self.id = id;
        self.role = role;
        self.player = player;
        
        self.heros = [];
        
        
        self.shape ={
            left: role===1?150:650,
            top: 50
        };
        heros.forEach((h,seq)=>{
           let heroObject = new Hero({
               parent:self,
               seq:seq,
               id:h.id,
               name:h.name,
               star:h.star,
               level:h.level,
               attrMap:h.attrMap,//属性集合
           })
            self.heros.push(heroObject);
        });
        
        // self.uiElement = new fabric.Group(self.heros.map(h=>h.getUIElements()), self.startPos);
    },
    prototype:{
        addToCanvas:function (canvas) {
            var self = this;
            
            self.heros.forEach((h)=>{
                let ele = h.getUIElements();
                
                ele.forEach((e)=>{
                    canvas.add(e);
                })
                
            });
            
        }
    }
});
module.exports={Team};