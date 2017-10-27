/**  todo:完整的测试战斗流程
 * Created by kaicui on 17/8/5.
 */


const oop = require("local-libs").oop;
const expect = require('chai').expect;
// const {Hero} = require("../role/hero");
// const {getRaceCamp} = require("../role/camp");

const {make,ref} = require('../../factory/factory'); //对象构造工厂，通过配置可以构造各种对象


describe("Battle", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should can work individually", function () {
        //先创建2个队伍，每个队伍6个英雄
        let hero1 = make({key:"光战1"});
        let hero2 = make({key:"光战1"});
        let hero3 = make({key:"光战1"});
        let hero4 = make({key:"光战1"});
        let hero5 = make({key:"光战1"});
        let hero6 = make({key:"光战1"});
        
        let hero7 = make({key:"地狱游侠1"});
        let hero8 = make({key:"地狱游侠1"});
        let hero9 = make({key:"地狱游侠1"});
        let hero10 = make({key:"地狱游侠1"});
        let hero11 = make({key:"地狱游侠1"});
        let hero12 = make({key:"地狱游侠1"});
        // expect(raceCamp3.getCampName()).to.eq('NEUTRAL');
    });
  
    
});
