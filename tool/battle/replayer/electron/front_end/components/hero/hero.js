
var {DataBar} = require("../../components/data_bar/data-bar");
const {WordLifeCycle,BattleEvents,HeroEvents} = require("../../../../../../../../domain/mechanism/lifeCycle");

module.exports={
    Hero:Vue.component('hero', {
        template: __inline("hero.html"),
        props:[
            "heroData",
            "index",
            "battleEnd",
            "curActor" //当前行动人id
        ],
        data: function () {
            return {
                isDead:false,
                currentUIState:"",//表示当前UI应该展示什么样式
                currentUIStateDesc:"",//表示当前UI样式的辅助信息（协助效果展示)
            }
        },
        components:{
            "DataBar":DataBar
        },
        created:function () {
        
        },
        methods:{
          dealWithLog:function ({eventCode,param,who,from,effect,type,attr,attrChanged,remark}) {
              var self = this;
              //每次新日志产生的时候，清除当前UI显示样式
              self.currentUIState = "";
              self.currentUIStateDesc = "";
              
              if(eventCode){
                  if(eventCode == HeroEvents.AFTER_HERO_FLEE){
                      //增加闪避效果
                      self.currentUIState = "flee";
                  }
                  else if(eventCode == HeroEvents.AFTER_HERO_DIE){
                      //设置死亡标记
                      self.isDead = true;
                  }
                  else if(eventCode == HeroEvents.AFTER_HERO_REBORN){
                      //设置死亡标记
                      self.isDead = false;
                  }
              }else if(attr){
                  if(remark && remark.cri){
                      self.currentUIState = "cri";
                  }
                  if(attr=="HP"){
                      self.currentUIStateDesc = attrChanged>0?"HP_ADD":"HP_DEC";
                  }
                  if(attr=="SP"){
                      self.currentUIStateDesc = attrChanged>0?"SP_ADD":"SP_DEC";
                  }
              }
          }
        },
        watch:{
            "heroData.logs":function (logs) {
                // console.log(v);
                let log = logs[0];
                this.dealWithLog(log);
            }
        }
    })
}