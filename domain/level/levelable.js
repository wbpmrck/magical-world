/**
 * Created by kaicui on 17/8/10.
 *
 * 表示一个可以进行升级的对象.
 *
 * 功能：
 * 1、可以设定初始level,level上限(都可以是Integer,可以被修正，且修正后会触发Level的正常工作)
 * 2、可以设定level经验累积，达到特定级别的数值曲线函数
 * 3、提供增加经验、增加等级等方法，方便的修改持有者的经验、等级
 *
 * 注意要点：
 * 1、levelCur:使用raw来表示对象当前实际的等级（被加成的不算原始等级，这样不会造成无法升级的情况)
 * 2、levelMax:使用total()来获取等级上线，也就意味着，可能会出现，在加成最大值阶段，升级levelCur,而造成的等级超出上线的情况（这是被允许的，而且，加成等级上限的技能，也比较少见）
 */

const oop = require("local-libs").oop;
const event = require("local-libs").event;
const Integer = require("../value/integer");
const Attribute = require("../attribute/attribute");
const {EffectAndAttrCarrier} = require("../effect/effectAndAttrCarrier");

/**
 * 辅助函数，用于获取升级到某个级别，需要新增的经验值
 * @param tableName
 * @param levelToGo
 * @returns {undefined}
 * @private
 */
function _getNeedExp(tableName, levelToGo) {
    let expNeed = undefined;
    let tb=require(`./data/${tableName}`);
    for(var i=0,j=tb.length;i<j;i++){
        var item = tb[i];
        if(levelToGo<=item.to && levelToGo>=item.from){
            expNeed =item.fn(levelToGo);
            break;
        }
    }
    return expNeed;
}

var Levelable = oop.defineClass({
    // super:undefined,
    super:EffectAndAttrCarrier, //todo:因为js里没有多继承，在后续的角色类中，需要集成levelable,effectCarrier,attributeCarrier等功能。这里暂时先修改levelable的基类，方便后续集成
    constructor:function({
        levelCur, //number,或者Attribute 对象，表示当前等级
        levelMax, //number,或者Attribute 对象，表示最高等级
        exp, // number,表示当前获得的经验值
        expTableName="small_03", // String，表示经验值增长曲线名称
    }){
        var self = this;
    
        event.mixin(self);
        
        if(typeof levelCur =='number'){
            // levelCur = new Integer(levelCur);
            levelCur = new Attribute("levelCur","当前等级",levelCur);
        }
        if(typeof levelMax =='number'){
            // levelMax = new Integer(levelMax);
            levelMax = new Attribute("levelMax","等级上限",levelMax);
        }
        
        self.levelCur = levelCur;
        self.levelMax = levelMax;
        self.exp = exp;
        self.expTableName = expTableName;
        
        
    },
    prototype:{
    
        /**
         * 修改exp(触发emit事件)
         * @param exp
         * @returns {--global-type--}
         */
        setExp:function (exp) {
            exp = parseInt(exp);
            let changed = this.exp != exp;
            if(changed){
                let old = this.exp;
                this.exp = exp;
                this.emit("expChange",old,exp); //通知外部变化
            }
            return this;
        },
        /**
         * 获取更多exp,返回当前的剩余总exp
         * @param expPoint:获取的exp
         * @returns {*}:当前剩余exp
         */
        acquireExp:function (expPoint) {
            var self = this;
            self.setExp(self.exp+expPoint);
            return self.exp;
        },
        /**
         * 根据当前的现状，对自身进行升级。返回是否升级成功
         * @returns {boolean}
         */
        levelUp:function () {
            var self = this;
            // let need = _getNeedExp(this.expTableName,this.levelCur.total()+1)
            let need = _getNeedExp(this.expTableName,this.levelCur.getVal()+1)
            // if(self.exp>=need && self.levelCur.raw<self.levelMax.total()){
            if(self.exp>=need && self.levelCur.val.raw<self.levelMax.getVal()){
                self.setExp(self.exp - need);
                self.levelCur.val.setRaw(self.levelCur.val.raw+1);
                return true;
            }else{
                return false;
            }
        },
        /**
         * 让这个单位一直升级到不能继续升级为止，同时返回升级了的级数
         * @returns {number}
         */
        levelUpAll:function () {
            var self = this;
            let upCount = 0;
            for(;;){
                let upOK = self.levelUp();
                if(upOK) {
                    upCount++;
                } else{
                    break;
                }
                
            }
            return upCount;
        },
        /**
         * 判断当前是否能够升级
         * @returns {boolean}
         */
        canLevelUp:function () {
            // return this.exp>=_getNeedExp(this.expTableName,this.levelCur.total()+1);
            return this.exp>=_getNeedExp(this.expTableName,this.levelCur.getVal()+1);
        }
    
    }
});

module.exports = Levelable;