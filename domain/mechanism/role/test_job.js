/**
 * Created by kaicui on 17/8/5.
 */


const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {getJob} = require("./job");


describe("Job", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can work individually", function () {
        let job1 = getJob(1);
        
        expect(job1.code).to.eq(1);
        expect(job1.name).to.eq('WARRIOR');
        
        let job2 = getJob(2);
        
        expect(job2.code).to.eq(2);
        expect(job2.name).to.eq('ASSASSIN');
    
    
    });
  
    
});
