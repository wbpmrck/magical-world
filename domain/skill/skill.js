/**
 * Created by kaicui on 17/8/7.
 *
 * 技能：
 *
 * 1、技能包含多个技能项目，技能定义了所属人，等级、当前熟练度（经验）等信息
 * 2、技能项目是一个有一定概率、在某些时刻、对某些对象，释放某些效果(effect)的集合
 *
 */




const oop = require("local-libs").oop;
const event = require("local-libs").event;
const IntegerValue = require("../value/integer");
const Levelable = require("../level/levelable");



var SkillItem = oop.defineClass({
    
    constructor:function({
        levelCur, //Integer 对象，表示当前等级
        probability,//Integer 对象，表示成功释放概率
        installCycle, //(可空)在什么生命周期去触发里面的effect的install
        targetChooser, //
        
        id, //技能项id
        name, //技能项名称
        desc, //技能项描述
        parent, //技能项持有者对象 (技能对象)
    }){
        var self = this;
        event.mixin(self);
        
        self.name = name;
        self.desc = desc;
        self.holder=  holder;
        self.items =[]; //技能项目初始化
    },
    prototype:{
        install:function () {
            
        }
    }
});

var Skill = oop.defineClass({
    super:Levelable,
    constructor:function({
        levelCur, //number，表示当前等级
        levelMax, //number，表示最高等级
        exp, // number,表示当前获得的经验值
        expTableName, // String，表示经验值增长曲线名称
    },{
        id, //技能id
        name, //技能名称
        desc, //技能描述
        holder, //技能持有者对象 (可以是人，也可以是物品)
    }){
        var self = this;
        event.mixin(self);
        
        self.name = name;
        self.desc = desc;
        self.holder=  holder;
        self.items =[]; //技能项目初始化
    },
    prototype:{
    
        /**
         * 添加一个技能项
         * @param id：技能项id
         * @param name:名称
         * @param desc:描述
         */
        addSkillItem:function ({
            id, //技能项id
            name, //技能项名称
            desc, //技能项描述
        }) {
            
            let item = new SkillItem({
                levelCur:this.levelCur, //Integer 对象，表示当前等级
                id:id, //技能项id
                name:name, //技能项名称
                desc:desc, //技能项描述
                parent:this, //技能项持有者对象 (技能对象)
            });
            this.items.add(item);
        }
    }
});


module.exports = {SkillItem,Skill};
