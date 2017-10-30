/**
 * Created by kaicui on 17/8/20.
 *
 * 基础chooser实现。
 *
 * 选择对象：按照指定位置，向前/后寻找n个敌人
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
         * @param params :{count: number,选择几个  mode: 0/1 向后/前  from:[0,5] 整数，查找起始位置， alive:bool (是选择活着的true，还是死掉的false) }
         * @returns {[*]}
         */
        chooseTarget:function (source,context,lifeCycleParams,params) {
            let choosed = [];
            
            //context此时应该是Battle对象
            let sourceTeam = source.team; //发起选择的人所在队伍
            let battle = source.team.battle;
            let enemyTeam = battle.getEnemyTeam(sourceTeam); //敌人队伍
            
            let index=params.from; //当前查找起始位置
            //找指定位置是否有对象
            while(
                choosed.length< params.count &&
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
                if(params.mode ===0){
                    index++;
                }else{
                    index--;
                }
                
                continue;
            }
            
            return choosed; //返回
        }
    }
});

module.exports = EnemyPositionOrderChooser;