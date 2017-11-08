
const {WordLifeCycle,BattleEvents,HeroEvents} = require("../../../../../../../../domain/mechanism/lifeCycle");

Vue.filter('displayEvent', function (evtObject) {
    var text = '';
    //todo:根据不同的事件类型，显示事件内容
    var {eventCode,param,who,from,effect,type,attr,attrChanged,remark} = evtObject;
    if(eventCode){
        if(eventCode == BattleEvents.BATTLE_BEGIN){
            text=`战斗开始`;
        }
        else if(eventCode == BattleEvents.BATTLE_END){
            text =`战斗结束`;
        }

        else if(eventCode == BattleEvents.TURN_BEGIN){
            text=`回合[${param}]开始`;
        }

        else if(eventCode == BattleEvents.TURN_END){
            text =`回合[${param}]结束`;
        }

        else if(eventCode == HeroEvents.BEFORE_ACTION){
            text =`[${who.name}]准备使用[${param.name}]`;
        }
        
        else if(eventCode == HeroEvents.AFTER_HERO_MISS){
            text =`[${who.name}]的[${param.effect.name}]没有打中[${param.missWho.name}]`;
        }
        else if(eventCode == HeroEvents.AFTER_HERO_FLEE){
            text =`[${who.name}]躲开了[${param.attacker.name}]的[${param.effect.name}]`;
        }
        else if(eventCode == HeroEvents.AFTER_HERO_DIE){
            text =`[${who.name}]死亡`;
        }
        else if(eventCode == HeroEvents.AFTER_HERO_REBORN){
            text =`[${who.name}]重生!`;
        }
        else{
            // text = JSON.stringify(evtObject);
            text = "";
        }
    }
    else if(effect && effect.name==='damageByATKAndDEF'){
        text=undefined;
    }else if(attr){
        if(attr==="HP"){
            if(attrChanged<0){
               if(remark && remark.cri){
                   text=`[${who.name}]受到${Math.abs(attrChanged)}点暴击伤害`;
               }else{
                   text=`[${who.name}]受到${Math.abs(attrChanged)}点伤害`;
               }
            }else{
                if(remark && remark.cri){
                    text=`[${who.name}]恢复${Math.abs(attrChanged)}点HP`;
                }else{
                    text=`[${who.name}]迅速恢复了${Math.abs(attrChanged)}点HP!`;
                }
            }
        }else{
            //属性变化日志
            text=`[${who.name}]的[${attr}]${attrChanged>0?'+':'-'}${attrChanged}`;
        }
    }else{
        // text = JSON.stringify(evtObject);
    }
    
    return text;
});