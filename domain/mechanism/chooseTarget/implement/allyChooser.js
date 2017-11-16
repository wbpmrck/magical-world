/**
 * Created by kaicui on 17/8/20.
 *
 * 基础chooser实现。
 *
 * 选择对象：寻找符合条件的队友
 */



const oop = require("local-libs").oop;
const event = require("local-libs").event;
const {ChooserBase} = require("../targetChooser");
const {isSingleHappen,multyChoose,getRandNum} = require("../../../math/random");

let AllyChooser = oop.defineClass({
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
         * @param params :
            {
         
            alive:bool (是选择活着的true，还是死掉的false. undefined 代表全部 )
            hasEffect:{category:effectCategoryEnum.NEGATIVE,name:"单个效果名称"},表示要选择当前身上有某一类效果的英雄
            count:6 //选择多少个
            orderBy:{attr:"HP",mode:"asc} //则表示优先选择HP最少的count个。可空（空则表示随机选择）PS:注意只能传入一个排序条件
         
         * }
         * @returns {[*]}
         */
        chooseTarget:function (source,context,lifeCycleParams,params) {
            let choosed = [];
            
            //context此时应该是Battle对象
            let sourceTeam = source.team; //发起选择的人所在队伍
            
            let {alive,hasEffect,count,orderBy} = params;
            
            //先把满足条件的选出来
            let candidate = sourceTeam.findHero((h)=>{
                if(alive !== undefined){
                    if(alive == h.isDead){
                        return false;
                    }
                }
                if(hasEffect !== undefined){
                    if(hasEffect.category !== undefined){
                        if(h.getEffect((ef)=>{return ef.params.category === hasEffect.category}).length<1){
                            return false;
                        }
                    }
                    if(hasEffect.name !== undefined){
                        if(!h.hasEffect(hasEffect.name)){
                            return false;
                        }
                    }
                }
                return true;
            });
            
            //从候选人里，按照要求取出指定人数的结果
            
            if(candidate.length<=count){
                //如果候选人数量不足，或刚好满足要求，则不筛选
                choosed = candidate;
            }else{
                //看是否需要排序
                if(orderBy !== undefined){
                    let {attr,mode} = orderBy;
                    
                    candidate = candidate.sort((a,b)=>{
                       if(mode === 'asc'){
                           return a.getAttr(attr).getVal() > b.getAttr(attr).getVal();
                       }else{
                           return a.getAttr(attr).getVal() < b.getAttr(attr).getVal();
                       }
                    });
                    
                    choosed = candidate.slice(0,count);
                
                }else{
                    //无需排序，则随机取n个
                    while(choosed.length<count){
                        let index = getRandNum(0,candidate.length-1);
                        choosed.push(candidate.splice(index,1));
                    }
                }
            }
          
            return choosed; //返回
        }
    }
});

module.exports = AllyChooser;