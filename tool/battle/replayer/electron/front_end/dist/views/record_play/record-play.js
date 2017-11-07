
// var Vue = require("../../libs/vue");


const path = require("path");
const url = require('url');
const querystring = require('querystring');
const fs = require("fs");

var {Hero} = require("../../components/hero/hero");


module.exports={
    component:Vue.component('record-play', {
        template: "<div id=\"record-play\">\n    <div class=\"pause btn\" @click=\"toggleStart(false)\">{{paused?\"继续\":\"暂停\"}}</div>\n    <div id=\"title\">{{recordData.attacker.name}}  VS  {{recordData.defender.name}}</div>\n\n    <div id=\"teams\">\n        <div id=\"attacker\" class=\"team\">\n\n            <Hero v-for=\"(hero,index) in recordData.detail.attackTeam.heros\" :hero-data=\"hero\" :index=\"index\" :battle-end=\"end\"></Hero>\n\n        </div>\n        <div id=\"defender\"  class=\"team\">\n            <Hero v-for=\"(hero,index) in recordData.detail.defendTeam.heros\" :hero-data=\"hero\" :index=\"index\" :battle-end=\"end\"></Hero>\n        </div>\n    </div>\n    <div id=\"events\">\n        <ul>\n            <li v-for=\"evt in events\">{{evt|displayEvent}}</li>\n        </ul>\n    </div>\n</div>",
        data: function () {
            return {
                recordData:undefined,
                end:false, //是否播放完毕
                paused:true, //是否暂停
                frameTimer:undefined,//控制播放速度的计时器
                events:[],//当前要展示的全局事件
                currentRound:0,//当前播放到的回合
                currentTick:-1,//当前播放到的tick
            }
        },
        components:{
            "Hero":Hero
        },
        
        methods:{
            findHero:function (who) {
                var attackTeam = this.recordData.detail.attackTeam;
                var defendTeam = this.recordData.detail.defendTeam;
                if(!who){
                    return;
                }
                let founded=attackTeam.heros.filter((h)=>{
                    return h.id === who.id
                });
                if(!founded || founded.length===0){
                    founded=defendTeam.heros.filter((h)=>{
                        return h.id === who.id
                    });
                }
                return founded[0];
            },
    
            toggleStart:function (isEnd) {
              var self = this;
              var ticks = self.recordData.detail.ticks;
              
              //确定结束了
              if(isEnd){
                  self.end = true;
                  self.paused = true;
              }else{
                  //切换暂停状态
                  self.paused = !self.paused;
              }
              
    
              //如果暂停了，取消定时器
              if(self.paused){
                  clearInterval(self.frameTimer);
                  self.frameTimer = undefined;
              }else{
                  self.frameTimer = setInterval(nextFrame,1000);
              }
              //开始读取下一帧战斗数据并展示
              function nextFrame() {
                  self.currentTick++;
        
                  //如果读取结束，则结束
                  if(self.currentRound > ticks.length-1){
                      self.toggleStart(true);
                      return;
                  }
        
                  //读取本回合下一帧
                  let frameEvents = ticks[self.currentRound][self.currentTick];
                  if(frameEvents){
                      for(var i=0,j=frameEvents.length;i<j;i++){
                          var frameEvent = frameEvents[i];
                          
                          
                          let happenHero = self.findHero(frameEvent.who);
    
                          //全局事件区域显示内容
                          self.events.push(frameEvent);
                          //如果是一个英雄触发的事件：
                          if(frameEvent.who && happenHero){
                              //添加到对应英雄的log里面
                              happenHero.logs.push(frameEvent);
                          }
                          if(frameEvent.effect){
                              //如果是效果相关
                              if(frameEvent.effect.name==='damageByATKAndDEF'){
                                  continue;
                              }else{
                                  //对象添加效果
                                  if(frameEvent.type==2){
                                      happenHero.effects.push(frameEvent.effect.id+frameEvent.effect.name);
                                  }
                                  //对象删除效果
                                  if(frameEvent.type==3){
                                      happenHero.effects.remove(frameEvent.effect.id+frameEvent.effect.name);
                                  }
                              }
                          }
                          if(frameEvent.attr){
                              //属性变化
                              //让对应hero接收属性变化
                              happenHero.attrMap[frameEvent.attr]+=frameEvent.attrChanged;
                          }
                
                      }
                  }else{
                      //进入下一回合
                      self.currentRound++;
                      self.currentTick=-1;
                      nextFrame();
                  }
        
              }
          }
        },
        created:function () {
    
            var self = this;
            var fileName = path.join(__dirname,"../../../../../data",this.$route.query.fileName);
    
            var data =require(fileName);
            var report = data.detail.report;
            var max_damage = 0;
            var max_heal = 0;
    
            for(var id in report.damage){
                if(report.damage[id]>=max_damage){
                    max_damage = report.damage[id];
                }
            }
            
            for(var id in report.heal){
                if(report.heal[id]>=max_heal){
                    max_heal = report.heal[id];
                }
            }
            
            data.detail.attackTeam.heros.forEach((h)=>{
                h.attrMap["HP"]=h.attrMap["HP_MAX"];
                h.attrMap["SP"]=0;
                h.logs = [];
                h.effects = [];
                h.total={
                    damage:report.damage[h.id],
                    heal:report.heal[h.id],
                    max_damage,
                    max_heal
                };
            });
            data.detail.defendTeam.heros.forEach((h)=>{
                h.attrMap["HP"]=h.attrMap["HP_MAX"];
                h.attrMap["SP"]=0;
                h.logs = [];
                h.effects = [];
                h.total={
                    damage:report.damage[h.id],
                    heal:report.heal[h.id],
                    max_damage,
                    max_heal
                };
            });
            this.recordData =data;
            
        }
    })
}