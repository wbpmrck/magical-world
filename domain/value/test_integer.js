/**
 * Created by kaicui on 17/8/5.
 */


const expect = require('chai').expect;
const IntegerValue = require("./integer");



describe("Integer Value", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("should work normal", function () {
        let int1 = new IntegerValue(10); //init a val,raw = 10
        
        let modifier1 = {addVal:-1};
        let modifier2 = {addPercent:0.3};
        int1.addModifier(modifier1,modifier1);
        
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(-1);//addVal = -1.so modify=-1
        expect(int1.total()).to.eql(9);//addVal = -1.so total = 10-1 = 9
    
    
        int1.addModifier(modifier2,modifier2);
    
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(2);
        expect(int1.total()).to.eql(12);
    });
    
    it("should can remove modifier", function () {
        let int1 = new IntegerValue(10); //init a val,raw = 10
        
        let modifier1 = {addVal:-1};
        let modifier2 = {addPercent:0.3};
        int1.addModifier(modifier1,modifier1);
        
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(-1);//addVal = -1.so modify=-1
        expect(int1.total()).to.eql(9);//addVal = -1.so total = 10-1 = 9
        
        
        int1.addModifier(modifier2,modifier2);
        
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(2);
        expect(int1.total()).to.eql(12);
        
        int1.removeModifier(modifier2);//remove m2
    
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(-1);//addVal = -1.so modify=-1
        expect(int1.total()).to.eql(9);//addVal = -1.so total = 10-1 = 9
    
        int1.removeModifier(modifier1);//remove m2
    
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(0);//addVal = -1.so modify=-1
        expect(int1.total()).to.eql(10);//addVal = -1.so total = 10-1 = 9
    
    
    });
    it("should can set raw", function () {
        let int1 = new IntegerValue(10); //init a val,raw = 10
        
        let modifier1 = {addVal:-1};
        let modifier2 = {addPercent:0.3};
        int1.addModifier(modifier1,modifier1);
        
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(-1);//addVal = -1.so modify=-1
        expect(int1.total()).to.eql(9);//addVal = -1.so total = 10-1 = 9
        
        
        int1.addModifier(modifier2,modifier2);
        
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(2);
        expect(int1.total()).to.eql(12);
        
        int1.setRaw(20);
        expect(int1.raw).to.eql(20);//raw  changed
        expect(int1.modify).to.eql(5);
        expect(int1.total()).to.eql(25);
    });
    
    it("should can limit raw range", function () {
        let int1 = new IntegerValue(10,{min:1,max:100}); //init a val,raw = 10 ,range [1,100]
        
        let modifier1 = {addVal:-1};
        let modifier2 = {addPercent:0.3};
        int1.addModifier(modifier1,modifier1);
        
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(-1);//addVal = -1.so modify=-1
        expect(int1.total()).to.eql(9);//addVal = -1.so total = 10-1 = 9
        
        
        int1.addModifier(modifier2,modifier2);
        
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(2);
        expect(int1.total()).to.eql(12);
        
        int1.setRaw(20);
        expect(int1.raw).to.eql(20);//raw  changed
        expect(int1.modify).to.eql(5);
        expect(int1.total()).to.eql(25);
        
        int1.setRaw(200);
        expect(int1.raw).to.eql(100);//arrive max value
        expect(int1.modify).to.eql(29);
        expect(int1.total()).to.eql(129);
        
        int1.setRaw(0);
        expect(int1.raw).to.eql(1);//arrive min value
        expect(int1.modify).to.eql(-1);
        expect(int1.total()).to.eql(0);
        
        //now change raw range,will affect the raw value
        int1.changeRawRange({min:10,max:50});
        expect(int1.raw).to.eql(10);//arrive min value
        expect(int1.modify).to.eql(2);
        expect(int1.total()).to.eql(12);
    });
    
    it("should can catch change event", function (done) {
        let int1 = new IntegerValue(10); //init a val,raw = 10
    
        int1.on("change",function (raw,modify,total,val) {
            expect(raw).to.eql(10);
            expect(modify).to.eql(-1);
            expect(total).to.eql(9);
            expect(val).to.eql(int1);
            done();
        });
        
        let modifier1 = {addVal:-1};
        int1.addModifier(modifier1,modifier1);
        
        expect(int1.raw).to.eql(10);//raw not changed
        expect(int1.modify).to.eql(-1);//addVal = -1.so modify=-1
        expect(int1.total()).to.eql(9);//addVal = -1.so total = 10-1 = 9
        
    });
    
});
