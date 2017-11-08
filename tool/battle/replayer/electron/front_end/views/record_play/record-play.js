
// var Vue = require("../../libs/vue");


const {WordLifeCycle,BattleEvents,HeroEvents} = require("../../../../../../../../domain/mechanism/lifeCycle");

const path = require("path");
const url = require('url');
const querystring = require('querystring');
const fs = require("fs");

var {Hero} = require("../../components/hero/hero");

var config={
    turnTime:{
        fast:500,
        normal:1500
    },
    frameTime:{
        fast:200,
        normal:600
    }
};
module.exports={
    component:Vue.component('record-play', {
        template: __inline("record-play.html"),
        data: function () {
            return {
                recordData:undefined,
                end:true, //是否播放完毕
                paused:true, //是否暂停
                config:config,
                speed:'normal',//切换快慢
                frameTimer:undefined,//控制播放速度的计时器
                events:[],//当前要展示的全局事件
                currentRound:0,//当前播放到的回合
                currentTick:0,//当前播放到的tick
                currentFrame:0,//当前播放到的tick里的frame
                curHero:"",//当前行动人id
            }
        },
        components:{
            "Hero":Hero
        },
        
        methods:{
            toggleSpeed:function () {
                this.speed = this.speed == 'normal'?'fast':'normal';
            },
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
              
              //确定结束了
              if(isEnd){
                  self.end = true;
                  self.paused = true;
              }else{
                  self.end = false;
                  //切换暂停状态
                  self.paused = !self.paused;
              }
          },
    
            initLoop:function () {
        
                var self = this;
        
                //
                // //开始读取下一帧战斗数据并展示
                // function nextTick() {
                //
                //     //如果暂停了，取消定时器
                //     if(self.paused){
                //         clearInterval(self.frameTimer);
                //         self.frameTimer = undefined;
                //     }else{
                //
                //         //如果读取结束，则结束
                //         if(self.currentRound > ticks.length-1){
                //             self.toggleStart(true);
                //             return;
                //         }
                //
                //         self.currentTick++;
                //
                //         //读取本回合下一帧
                //         let frameEvents = ticks[self.currentRound][self.currentTick];
                //         if(frameEvents){
                //             for(var i=0,j=frameEvents.length;i<j;i++){
                //                 var frameEvent = frameEvents[i];
                //
                //
                //                 let happenHero = self.findHero(frameEvent.who);
                //
                //                 //全局事件区域显示内容
                //                 self.events.unshift(frameEvent);
                //                 //如果是一个英雄触发的事件：
                //                 if(frameEvent.who && happenHero){
                //                     //添加到对应英雄的log里面
                //                     happenHero.logs.unshift(frameEvent);
                //                 }
                //                 if(frameEvent.effect){
                //                     //如果是效果相关
                //                     if(frameEvent.effect.name==='damageByATKAndDEF'){
                //                         continue;
                //                     }else{
                //                         //对象添加效果
                //                         if(frameEvent.type==2){
                //                             happenHero.effects.unshift(frameEvent.effect.id+frameEvent.effect.name);
                //                         }
                //                         //对象删除效果
                //                         if(frameEvent.type==3){
                //                             happenHero.effects.remove(frameEvent.effect.id+frameEvent.effect.name);
                //                         }
                //                     }
                //                 }
                //                 if(frameEvent.attr){
                //                     //属性变化
                //                     //让对应hero接收属性变化
                //                     happenHero.attrMap[frameEvent.attr]+=frameEvent.attrChanged;
                //                 }
                //
                //             }
                //         }else{
                //             //进入下一回合
                //             self.currentRound++;
                //             self.currentTick=-1;
                //             self.currentFrame=-1;
                //         }
                //     }
                //
                //     self.frameTimer = setTimeout(nextTick,self.speed);
                // }
        
                //开始读取下一帧战斗数据并展示
                function nextFrame() {
    
                    var rounds = self.recordData.detail.ticks;
                    var ticks = rounds[self.currentRound];
                    var frames = ticks[self.currentTick];
                    let jumpFrame=false;//是否跳过本帧，不通过timer直接进入下一帧(用于跳过一些不需要展示的frame)
                    let changeTurn = false;//当前是回合衔接处（影响停顿时间）
                    //如果暂停了，取消定时器
                    if(self.paused){
                        clearInterval(self.frameTimer);
                        self.frameTimer = undefined;
                    }else{
                
                        //如果所有回合结束，则结束
                        if(self.currentRound > rounds.length-1){
                            self.toggleStart(true);
                        }
                        //如果回合所有tick结束，进入下一回合
                        else if(self.currentTick > ticks.length-1){
                            self.currentRound++;
                            self.currentTick=0;
                            self.currentFrame=0;
                            changeTurn = true;
                        }
                
                        //如果当前tick的帧播放完，进入下一tick
                        else if(!frames || self.currentFrame > frames.length-1){
                            self.currentTick++;
                            self.currentFrame=0;
                        }
                        else{
    
                            var frameEvent = frames[self.currentFrame];
    
    
                            let happenHero = self.findHero(frameEvent.who);
    
                            //全局事件区域显示内容
                            self.events.unshift(frameEvent);
                            //如果是一个英雄触发的事件：
                            if(frameEvent.who && happenHero){
                                //添加到对应英雄的log里面
                                happenHero.logs.unshift(frameEvent);
                                
                                if(frameEvent.eventCode === HeroEvents.BEFORE_ACTION){
                                    //设置当前行动人
                                    self.curHero = happenHero.id;
                                }
                            }
                            if(frameEvent.effect){
                                //如果是效果相关
                                if(frameEvent.effect.name==='damageByATKAndDEF'){
                                    jumpFrame = true;
                                }else{
                                    //对象添加效果
                                    if(frameEvent.type==2){
                                        happenHero.effects.unshift(frameEvent.effect.id+frameEvent.effect.name);
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
                                happenHero.attrMap[frameEvent.attr]=frameEvent.attrTotal;
                            }
                            self.currentFrame++;
                        }
                
                    }
                    if(jumpFrame){
                        if(changeTurn){
                            self.frameTimer = setTimeout(nextFrame,config.turnTime[self.speed]);
                        }else{
                            nextFrame();
                        }
                    }else{
    
                        if(changeTurn){
                            self.frameTimer = setTimeout(nextFrame,config.turnTime[self.speed]);
                        }else{
                            self.frameTimer = setTimeout(nextFrame,config.frameTime[self.speed]);
                        }
                        
                    }
                }
    
    
                //运行循环
                nextFrame();
            }
        },
        created:function () {
    
            var self = this;
            var fileName = path.join(__dirname,"../../../../../data",this.$route.query.fileName);
    
            var data =require(fileName);
            var report = data.detail.report;
            var max_damage = 0;
            var max_heal = 0;
            
            console.log(data);
    
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
    
            self.initLoop();
        }
    })
}