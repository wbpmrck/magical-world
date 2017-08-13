/**
 * Created by kaicui on 17/8/10.
 *
 * 这是一个工具，用于根据data里设置的经验值表，来在console里打印出各个等级需要的经验值，以及与上一级的差距。方便可视化查看
 */

var padEnd = require('string.prototype.padend');

if(process.argv.length<2){
    console.log("please input dataTable name!");
    process.exit(-1);
}
const dataNameToPrint = process.argv[2];

let dataTable = require(`../data/${dataNameToPrint}`);

if(dataTable){
    let
        expTable =[] ,//记录每个等级需要的经验值
        stepTable =[] ,//记录每个等级举例上一个的差
        expOutput=[],//用于输出经验值表
        expStepOutput=[]; //用于输出经验值增量差表
    
    for(var i=0,j=dataTable.length;i<j;i++){
        let {from,to,fn} = dataTable[i]; //拿到一条规则
        
        for(var m=from,n=to;m<=n;m++){
            let _exp = fn(m);
            expTable.push(_exp);
            // expOutput.push(_exp.toString().padEnd(10," "));//
            expOutput.push(padEnd(_exp.toString(),10," "));//
        }
        expOutput.push('\r\n')
    }
    // console.log(`expTable.length=${expTable.length}`);
    //根据经验值表计算step
    let pre=0;
    for(var i=0,j=expTable.length;i<j;i++){
        let _exp = expTable[i];
        let _step = _exp-pre;
        stepTable.push(_step);
        pre = _exp;
    }
    
    // console.log(`stepTable.length=${stepTable.length}`);
    let seed =1;//从开始计数
    for(var i=0,j=dataTable.length;i<j;i++){
        let {from,to,fn} = dataTable[i]; //拿到一条规则
    
        
        for(;seed<=to;seed++) {
            expStepOutput.push(padEnd(stepTable[seed-1].toString(), 10, " "));
        }
        expStepOutput.push('\r\n')
    }
    
    console.log("经验值表（可以用于每升1级额外需要的经验）:\r\n")
    console.log(expOutput.join(''));
    console.log("\r\n")
    
    console.log("经验值差额表(相邻2个级别，升级需要经验差额):\r\n")
    console.log(expStepOutput.join(''));
    console.log("EOF\r\n")
}else{
    console.log(`can not find js : ../data/${dataNameToPrint}`);
    process.exit(-1);
}