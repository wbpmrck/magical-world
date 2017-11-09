
(function (global,player) {
    const path = require("path");
    const url = require('url');
    const querystring = require('querystring');
    const fs = require("fs");
    
    const {Team} = require("./ui/team");
    const {WordLifeCycle,BattleEvents,HeroEvents} = require("../../../../../../domain/mechanism/lifeCycle");
    //配置项
    var configs={
        ui:{
            heroPerTeam:6,//每队的hero数量
            dataUrl:"" //获取数据的地址
        }
    };
    
    /**
     * 获取当前需要展示的战斗报告数据对象
     * @returns {any}
     */
    function getLogData() {
    
        var fileName = querystring.parse(url.parse(location.href).query).file;
        var fileName = path.join(__dirname,"../../../data",fileName);
    
        var data = require(fileName);
        return data;
    }
    
    
    var recordData = getLogData();
    var attackTeam = new Team(recordData.detail.attackTeam);
    var defendTeam = new Team(recordData.detail.defendTeam);
    
    
    // create a wrapper around native canvas element (with id="c")
    var canvas = new fabric.Canvas('board',{
        width:1000,
        height:800
    });
    
    var title = new fabric.Text(`${recordData.attacker.name} vs ${recordData.defender.name}`,{
        left:300,
        top:5,
    });
    
    canvas.add(title);
    attackTeam.addToCanvas(canvas);
    defendTeam.addToCanvas(canvas);

    canvas.renderAll();
    
    
    
    var frameTimer = undefined;
    var ticks = recordData.detail.ticks;
    var currentRound = 0;
    var currentTick = -1;
    
    //开始读取下一帧战斗数据并展示
    function nextFrame() {
        currentTick++;
        
        //如果读取结束，则结束
        if(currentRound > ticks.length-1){
            toggleStart();
            alert("播放结束!");
            return;
        }
        
        //读取本回合下一帧
        let frameEvents = ticks[currentRound][currentTick];
        if(frameEvents){
            for(var i=0,j=frameEvents.length;i<j;i++){
                var frameEvent = frameEvents[i];
                
                var happenHero = findHero(frameEvent.who);
                
                //如果是一个事件：
                if(frameEvent.eventCode){
                    logEvent(frameEvent);
                }else if(frameEvent.effect){
                    //如果是效果相关
                    if(frameEvent.effect.name==='damageByATKAndDEF'){
                        continue;
                    }else{
                        //对象添加效果
                        if(frameEvent.type==2){
                            happenHero.vm.effects.push(frameEvent.effect.id+frameEvent.effect.name);
                        }
                        //对象删除效果
                        if(frameEvent.type==3){
                            happenHero.vm.effects.remove(frameEvent.effect.id+frameEvent.effect.name);
                        }
                    }
                }else if(frameEvent.attr){
                    //属性变化
                    //让对应hero接收属性变化
                    happenHero.acceptAttrChange(frameEvent);
                }
                
            }
        }else{
            //进入下一回合
            currentRound++;
            currentTick=-1;
            nextFrame();
        }
        
    }
    
    
    var paused = true;
   
    function logEvent({eventCode,param,who,from,effect,type,attr,attrChanged}) {
        console.log("-------------------");
        if(eventCode){
            
            if(eventCode == BattleEvents.TURN_BEGIN){
                console.log(`回合[${currentRound+1}]开始`);
            }
            if(eventCode == BattleEvents.TURN_END){
                console.log(`回合[${currentRound+1}]结束`);
            }
            if(eventCode == HeroEvents.BEFORE_ACTION){
                console.log(`${who.name}准备使用[${param.name}]`);
            }
        }
        
        console.log("-------------------");
    }
    function toggleStart() {
        paused = !paused;
        
        if(paused){
            clearInterval(frameTimer);
            frameTimer = undefined;
        }else{
            frameTimer = setInterval(nextFrame,1000);
        }
    }
    
    function findHero(who) {
        if(!who){
            return;
        }
        let founded=attackTeam.heros.filter((h)=>{
            return h.vm.id === who.id
        });
        if(!founded || founded.length===0){
            founded=defendTeam.heros.filter((h)=>{
                return h.vm.id === who.id
            });
        }
        return founded[0];
    }
    
    
    //自动播放
    setTimeout(toggleStart,5000);
    
    setInterval(function () {
        canvas.renderAll();
    },20);
    return{
        player
    }
    
    
})(window,{});