/**
 * Created by kaicui on 17/8/5.
 */


const expect = require('chai').expect;
const {Effect,EffectEvents} = require("./effect");
const Integer = require("../value/integer");



describe("Effect ", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should work", function () {
        
        let level = new Integer(10,{min:1,max:100});
        // let effect1 = new Effect({name:"effect",desc:"effect desc",level:level,params:{a:1}});
        let effect1 = new Effect({level:level,params:{a:1}});
        
        // expect(effect1.toString()).to.eql('level[10][effect][effect desc]');//`level[${this.level.total()}][${this.name}][${this.desc}]`;
        
        //change level from outside
    
        let modifier1 = {addVal:1};
        level.addModifier(modifier1,modifier1);
        // expect(effect1.toString()).to.eql('level[11][effect][effect desc]');
    });
    
    // it("should can install to object,and detect event", function (done) {
    //
    //     let level = new Integer(10,{min:1,max:100});
    //     let effect1 = new Effect({name:"effect",desc:"effect desc",level:level,params:{a:1}});
    //
    //     expect(effect1.toString()).to.eql('level[10][effect][effect desc]');//`level[${this.level.total()}][${this.name}][${this.desc}]`;
    //
    //     var source={},target={};
    //     effect1.on(EffectEvents.INSTALLED,(ef)=>{
    //         expect(ef).to.eql(effect1);
    //         expect(ef.source).to.eql(source);
    //         expect(ef.target).to.eql(target);
    //         done();
    //     })
    //     effect1.onInstall(source,target);
    //
    // });
    // it("should can uninstall from object,and detect event", function (done) {
    //
    //     let level = new Integer(10,{min:1,max:100});
    //     let effect1 = new Effect({name:"effect",desc:"effect desc",level:level,params:{a:1}});
    //
    //     expect(effect1.toString()).to.eql('level[10][effect][effect desc]');//`level[${this.level.total()}][${this.name}][${this.desc}]`;
    //
    //     var source={},target={};
    //     effect1.onInstall(source,target);
    //
    //     effect1.on(EffectEvents.UNINSTALLED,(ef)=>{
    //         expect(ef).to.eql(effect1);
    //         expect(ef.source).to.eql(undefined);
    //         expect(ef.target).to.eql(undefined);
    //         done();
    //     });
    //     effect1.onUninstall();
    //
    // });
    
    
});
