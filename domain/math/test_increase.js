/**
 * Created by kaicui on 17/8/5.
 */


const expect = require('chai').expect;
const increase = require("./increase");

describe("increase math function", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("linear work", function () {
        let result1 = increase.linear(10);  //result = 10
        let result2 = increase.linear(20);  //result = 20
        let result3 = increase.linear(30);  //result = 20
        
        expect(result1).to.eql(10);
        expect(result2).to.eql(20);
        expect(result3).to.eql(30);
        
        //linear with factor
    
        let result4 = increase.linear(10,2);  //result = 10*2
        let result5 = increase.linear(20,2);  //result = 20*2
        let result6 = increase.linear(30,2);  //result = 20*2
    
        expect(result4).to.eql(20);
        expect(result5).to.eql(40);
        expect(result6).to.eql(60);
    });
    
    
});
