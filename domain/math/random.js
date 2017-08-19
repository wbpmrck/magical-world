/**
 * Created by kaicui on 17/8/19.
 * 该模块用于处理随机相关的场景
 *
 * 场景1：单个概率事件是否发生
 * 1、系统内置好各种概率(从0%到100%的发生器)
 * 2、当外部发生一个概率事件的时候，直接获取对应的发生器，然后判断事件是否命中
 *
 * 场景2：多个事件一起按照概率分布发生，必须选择一个
 * 1、必须事先准备好各种可能的组合发生器，内置在系统里
 * 2、事件发生的时候，选择合适的组合发生器，发生器会给出一个结果
 */


const MAX_POSSIBILITY = 1000; //概率上限
const RAND_NUMBER_LEN = 10 * 10000; //内置随机数列长度 (默认10w)

let numberPool = new Array(RAND_NUMBER_LEN);
for(var i=0,j=numberPool.length;i<j;i++){
    numberPool[i] = parseInt(Math.random()*MAX_POSSIBILITY); //准备好整数放进去
}



let cursorOfPool = -1;
/**
 * 返回游标地址，如果到头了从头再来
 * @returns {number}
 */
let nextCursor=function () {
    cursorOfPool++;
    if(cursorOfPool==numberPool.length-1){
        cursorOfPool = 0
    }
    return cursorOfPool;
}
/**
 * 内部函数:从随机数队列里取出下一个
 * @returns {*}
 */
let findNextFromPool=function(){
    return numberPool[nextCursor()];
}

module.exports={
    
    /**
     * 返回一个[min,max]之间的随机数
     * @param min
     * @param max
     */
    getRandNum:function (minNum, maxNum) {
        switch(arguments.length){
            case 1:
                return parseInt(findNextFromPool()/MAX_POSSIBILITY*minNum,10);
                break;
            case 2:
                return parseInt(findNextFromPool()/MAX_POSSIBILITY*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
        }
    },
    /**
     * 直接给出指定概率的事件是否发生的结果
     * @param possibility:bool
     * @returns {*}
     */
    isSingleHappen:function (possibility) {
        return findNextFromPool()<possibility
    },
    /**
     * 判断一组事件应该发生哪一个
     * @param arrayOfPossibility:形如:[p1,p2,p3]  注意:p1+p2+p3应该 < MAX_POSSIBILITY
     * @return int:代表此次发生的事件下标(从0开始)
     */
    multyChoose:function (arrayOfPossibility) {
        let numberSteps = new Array(arrayOfPossibility.length); //定义一个和对应事件等长度的数组。用于存放对应事件代表的数字阈值(单调递增)
        for(var i=0,j=arrayOfPossibility.length;i<j;i++){
            let pn = arrayOfPossibility[i];
            if(i==0){
                numberSteps[i]=pn;
            }else{
                numberSteps[i]=numberSteps[i-1]+pn;
            }
        }
        let randNum = findNextFromPool(); //拿到一个事先准备好的随机数
        
        for(var i=0,j=numberSteps.length;i<j;i++){
            let step = numberSteps[i];
            if(randNum<step){
                return i;
            }
        }
        return -1; //如果都没有发生，返回-1
    }
}