/**
 * Created by kaicui on 17/8/5.
 */


const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {Star} = require("./star");


describe("Star", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can work", function () {
        let star1 = new Star(1);
        
        expect(star1.level).to.eq(1);
        star1.levelUp();
        expect(star1.level).to.eq(2);
        
        star1.once("beforeUp",function(oldLevel,newLevel){
            expect(oldLevel).to.eq(2);
            expect(newLevel).to.eq(3);
        });
        let success = star1.levelUp();
        expect(star1.level).to.eq(3);
        expect(success).to.eq(true);
        
        let success2 = star1.levelUp();
        let success3 = star1.levelUp();
        let success4 = star1.levelUp();
        expect(success2).to.eq(true);
        expect(success3).to.eq(true);
        expect(success4).to.eq(false);
    });
  
    
});
