/**
 * Created by kaicui on 17/8/5.
 */


const expect = require('chai').expect;
const {isSingleHappen,multyChoose,getRandNum} = require("./random");

describe("random.isSingleHappen", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("can work", function () {
        
        //for 1000,everytime will happen
        for(var i=0,j=1*10000;i<j;i++){
            expect(isSingleHappen(1000)).to.eql(true);
        }
        
        //for 500, about half will happen
        let happend = 0;
        for(var i=0,j=10*10000;i<j;i++){
            if(isSingleHappen(500)){
                happend++;
            }
        }
        //error must small than 400
        expect(happend).to.gt(49300);
        expect(happend).to.lt(50600);
    
        //for 800, about 4/5 will happen
        happend = 0;
        for(var i=0,j=10*10000;i<j;i++){
            if(isSingleHappen(800)){
                happend++;
            }
        }
        expect(happend).to.gt(79600);
        expect(happend).to.lt(80400);
        
        //for 200, about 1/5 will happen
        happend = 0;
        for(var i=0,j=10*10000;i<j;i++){
            if(isSingleHappen(200)){
                happend++;
            }
        }
        expect(happend).to.gt(19600);
        expect(happend).to.lt(20400);
        
    });
});

describe("random.multyChoose", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("can work", function () {
        
        //for 1000,everytime will happen
        for(var i=0,j=1*10000;i<j;i++){
            expect(multyChoose([1000,0])).to.eql(0);
        }
        for(var i=0,j=1*10000;i<j;i++){
            expect(multyChoose([0,1000])).to.eql(1);
        }
        let result =[0,0,0,0]
        for(var i=0,j=10*10000;i<j;i++){
            let id = multyChoose([200,200,300,300]);
            result[id]++;
        }
        expect(result[0]).to.gt(19400);
        expect(result[0]).to.lt(20600);
        
        expect(result[1]).to.gt(19400);
        expect(result[1]).to.lt(20600);
        
        expect(result[2]).to.gt(29400);
        expect(result[2]).to.lt(30600);
        
        expect(result[3]).to.gt(29400);
        expect(result[3]).to.lt(30600);
    
    });
});
describe("random.getRandNum", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("can work", function () {
        let result = new Array(10);
        
        for(var i=0,j=result.length;i<j;i++){
            result[i] = 0;
        }
    
        for(var i=0,j=100*10000;i<j;i++){
            let num = getRandNum(0,9);
            result[num]++
        }
    
        for(var i=0,j=result.length;i<j;i++){
            // try{
    
                expect(result[i]).to.gt(94000);
                expect(result[i]).to.lt(105000);
            // }
            // catch (e){
                // console.log(result);
            // }
        }
    
    });
});
