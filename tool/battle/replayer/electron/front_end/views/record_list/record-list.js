
// var Vue = require("../../libs/vue");
var fs = require("fs");
var path = require("path");

module.exports={
    component:Vue.component('record-list', {
        template: __inline("record-list.html"),
        data: function () {
            return {
                records:[]
            }
        },
        activated:function () {
            console.log("record activated");
        },
        created:function () {
            var self = this;
        
            var logs = fs.readdirSync(path.join(__dirname,"../../../../../data"));
        
            logs = logs.filter((file)=>{return file.indexOf("end")>0});
            console.log(logs);
        
            self.records = logs;
        
        },
        methods:{
            /**
             * 跳转到player页面，通过queryString传入要播放的文件记录名
             * @param fileName
             */
            go:function (fileName) {
                this.$router.push({ name: 'recordPlay', query: { fileName: fileName }})
                // location.href = path.join(__dirname,"../player/player.html")+"?file="+fileName;
            }
        }
    })
}