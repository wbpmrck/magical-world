/**
 * Created by kaicui on 17/8/5.
 */


const oop = require("local-libs").oop;
const expect = require('chai').expect;
const {Hero} = require("./hero");
const {getRaceCamp} = require("./camp");


describe("Camp", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can work individually", function () {
        let raceCamp = getRaceCamp(1);
        
        expect(raceCamp.getRaceCode()).to.eq(1);
        expect(raceCamp.getRaceName()).to.eq('LIGHT');
        expect(raceCamp.getCampCode()).to.eq(1);
        expect(raceCamp.getCampName()).to.eq('JUSTICE');
    
    
        let raceCamp2 = getRaceCamp(4);
    
        expect(raceCamp2.getRaceCode()).to.eq(4);
        expect(raceCamp2.getRaceName()).to.eq('HELL');
        expect(raceCamp2.getCampCode()).to.eq(2);
        expect(raceCamp2.getCampName()).to.eq('EVIL');
    
        let raceCamp3 = getRaceCamp(8);
    
        expect(raceCamp3.getRaceCode()).to.eq(8);
        expect(raceCamp3.getRaceName()).to.eq('ENTS');
        expect(raceCamp3.getCampCode()).to.eq(0);
        expect(raceCamp3.getCampName()).to.eq('NEUTRAL');
    });
  
    
});
