
const path = require("path");
const fs = require("fs");

var vm = new Vue({
    el: '#root',
    data: {
        records:[]
    },
    created:function () {
        var self = this;
    
        var logs = fs.readdirSync(path.join(__dirname,"../../../data"));
    
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
            location.href = path.join(__dirname,"../player/player.html")+"?file="+fileName;
        }
    }
})

