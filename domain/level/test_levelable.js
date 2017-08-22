/**
 * Created by kaicui on 17/8/12.
 */


const expect = require('chai').expect;
const Levelable = require("./levelable");
const oop = require("local-libs").oop;
const Integer = require("../value/integer");
const Attribute = require("../attribute/attribute");

 describe("levelable", function () {
     beforeEach(function () {
         //run before each test
     });
     afterEach(function () {
         //run after each test
     });
 
     it("should work with it self", function () {
         let levelable1 = new Levelable({
             levelCur:0, //number,或者Integer 对象，表示当前等级
             levelMax:4, //number,或者Integer 对象，表示最高等级
             exp:0, // number,表示当前获得的经验值
         });
    
         expect(levelable1.canLevelUp()).to.eql(false);
         
         levelable1.acquireExp(21); //need 1 to arrive level1
         expect(levelable1.exp).to.eql(21);
         expect(levelable1.canLevelUp()).to.eql(false);
         levelable1.acquireExp(1); // arrive level1
         expect(levelable1.exp).to.eql(22);
         expect(levelable1.canLevelUp()).to.eql(true);
         
         //level up and dec the exp
         levelable1.levelUp();
         expect(levelable1.exp).to.eql(0);
         expect(levelable1.levelCur.val.raw).to.eql(1);
         expect(levelable1.levelCur.val.total()).to.eql(1);
         
         //get more exp
         levelable1.acquireExp(200); //can arrive level5
         expect(levelable1.exp).to.eql(200);
         expect(levelable1.canLevelUp()).to.eql(true);
         
         //levelUp to lv5 ,BUT,the max level=4,so can arrive 4
         let upped=levelable1.levelUpAll();
         expect(upped).to.eql(3);
         expect(levelable1.exp).to.eql(84);
         expect(levelable1.levelCur.val.raw).to.eql(4);
         
         
     });
     it("should work with its subclass", function () {
         let hero = oop.defineClass({
             super:Levelable,
             constructor:function({
             },name){
                 var self = this;
                 self.name = name;
             },
             prototype:{
                
             }
         });
    
         let levelable1 = new hero({
             levelCur:0, //number,或者Integer 对象，表示当前等级
             levelMax:4, //number,或者Integer 对象，表示最高等级
             exp:0, // number,表示当前获得的经验值
         },"jack");
    
         expect(levelable1.name).to.eql("jack");
         expect(levelable1.canLevelUp()).to.eql(false);
    
         levelable1.acquireExp(21); //need 1 to arrive level1
         expect(levelable1.exp).to.eql(21);
         expect(levelable1.canLevelUp()).to.eql(false);
         levelable1.acquireExp(1); // arrive level1
         expect(levelable1.exp).to.eql(22);
         expect(levelable1.canLevelUp()).to.eql(true);
    
    
         //level up and dec the exp
         levelable1.levelUp();
         expect(levelable1.exp).to.eql(0);
         expect(levelable1.levelCur.val.raw).to.eql(1);
         expect(levelable1.levelCur.val.total()).to.eql(1);
    
         //get more exp
         levelable1.acquireExp(200); //can arrive level5
         expect(levelable1.exp).to.eql(200);
         expect(levelable1.canLevelUp()).to.eql(true);
    
         //levelUp to lv5 ,BUT,the max level=4,so can arrive 4
         let upped=levelable1.levelUpAll();
         expect(upped).to.eql(3);
         expect(levelable1.exp).to.eql(84);
         expect(levelable1.levelCur.val.raw).to.eql(4);
     });
     it("should can customize exp function name", function () {
         let levelable1 = new Levelable({
             levelCur:0, //number,或者Integer 对象，表示当前等级
             levelMax:5, //number,或者Integer 对象，表示最高等级
             exp:0, // number,表示当前获得的经验值
             expTableName:"small_02"
         });
    
         expect(levelable1.canLevelUp()).to.eql(false);
    
         levelable1.acquireExp(29); //need 1 to arrive level1
         expect(levelable1.exp).to.eql(29);
         expect(levelable1.canLevelUp()).to.eql(false);
         levelable1.acquireExp(1); // arrive level1
         expect(levelable1.exp).to.eql(30);
         expect(levelable1.canLevelUp()).to.eql(true);
    
         //level up and dec the exp
         levelable1.levelUp();
         expect(levelable1.exp).to.eql(0);
         expect(levelable1.levelCur.val.raw).to.eql(1);
         expect(levelable1.levelCur.val.total()).to.eql(1);
    
         //get more exp
         levelable1.acquireExp(400);
         expect(levelable1.exp).to.eql(400);
         expect(levelable1.canLevelUp()).to.eql(true);
    
         //levelUp to lv6 ,BUT,the max level=5,so can arrive 5
         let upped=levelable1.levelUpAll();
         expect(upped).to.eql(4);
         expect(levelable1.exp).to.eql(80);
         expect(levelable1.levelCur.val.raw).to.eql(5);
     });
     
     it("should can level up even if the levelCur is modified to equal levelMax", function () {
         let levelable1 = new Levelable({
             // levelCur:new Integer(0), //number,或者Integer 对象，表示当前等级
             levelCur:new Attribute("levelCur","",0), //number,或者 Attribute 对象，表示当前等级
             // levelMax:new Integer(5), //number,或者Integer 对象，表示最高等级
             levelMax:new Attribute("levelMax","",5), //number,或者 Attribute 对象，表示最高等级
             exp:0, // number,表示当前获得的经验值
             expTableName:"small_02"
         });
    
         expect(levelable1.canLevelUp()).to.eql(false);
         
         //modify currentLevel
    
         levelable1.acquireExp(29); //need 1 to arrive level1
         expect(levelable1.exp).to.eql(29);
         expect(levelable1.canLevelUp()).to.eql(false);
         levelable1.acquireExp(1); // arrive level1
         expect(levelable1.exp).to.eql(30);
         expect(levelable1.canLevelUp()).to.eql(true);
     });
 });