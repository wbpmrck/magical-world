/**
 * Created by kaicui on 17/8/20.
 *
 * 基础chooser实现。
 *
 * 选择对象：寻找所有敌人
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const {ChooserBase} = require("../targetChooser");

let EnemyPositionOrderChooser = oop.defineClass({
    super:ChooserBase,
    constructor:function(){
        var self = this;
    },
    prototype:{
        /**
         *
         * @param source
         * @param context
         * @param lifeCycleParams
         * @param params :{alive:bool (是选择活着的true，还是死掉的false) }
         * @returns {[*]}
         */
        chooseTarget:function (source,context,lifeCycleParams,params) {
            let choosed = [];
            
            //context此时应该是Battle对象
            let sourceTeam = source.team; //发起选择的人所在队伍
            let battle = sourceTeam.battle;
            let enemyTeam = battle.getEnemyTeam(sourceTeam); //敌人队伍
            
            let index=0; //当前查找起始位置
            //找指定位置是否有对象
            while(
            index <=5 && index >= 0
                ){
                let found = enemyTeam.heros[index];
                
                if(found){
                    //判断死活
                    if( ( found.isDead && !params.alive) || (!found.isDead && params.alive) ){
                        choosed.push(found);
                    }
                }
                //下一个
                index++;
                continue;
            }
            
            return choosed; //返回
        }
    }
});

module.exports = EnemyPositionOrderChooser;