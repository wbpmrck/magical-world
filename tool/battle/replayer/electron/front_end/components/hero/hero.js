
var {DataBar} = require("../../components/data_bar/data-bar");

module.exports={
    Hero:Vue.component('hero', {
        template: __inline("hero.html"),
        props:["heroData","index","battleEnd"],
        data: function () {
            return {
            }
        },
        components:{
            "DataBar":DataBar
        },
        created:function () {
        
        }
    })
}