
// var Vue = require("../../libs/vue");
// var vueRouter = require("../../libs/vue-router");

var filter = require("../../framework/ui/vue-filter");


Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

exports.init=function (userInfo) {
    
    
    // Vue.use(VueRouter);
    // var bus = new Vue();
    // Vue.mixin({
    //     data:function(){
    //         return {
    //             bus:bus,
    //             userInfo:userInfo
    //         }
    //     }
    // });
    
    const Foo = { template: '<div>foo</div>' }
    
    
    var router = new VueRouter({
        mode: 'hash',
        routes: [
            { path: '/',
                redirect: '/recordList'
            },
            { path: '/recordList',
                name: 'recordList',
                // component: require("../record_list/record-list").component,
                component: require("../record_list/record-list").component,
            },,
            { path: '/recordPlay',
                name: 'recordPlay',
                // component: require("../record_list/record-list").component,
                component: require("../record_play/record-play").component,
            },
            // { path: '/subject/index',
            //     name: 'subject',
            //     component: require("cp.subject").init(),
            // },
            // { path: '/subject/new',
            //     name: 'subject-new',
            //     component: require("cp.subject.edit").init(),
            //     meta:{
            //         mode:"create"
            //     }
            // },
            // { path: '/subject/edit/:id',
            //     name: 'subject-edit',
            //     component: require("cp.subject.edit").init(),
            //     meta:{
            //         mode:"update"
            //     }
            // },
            // { path: '/knowledge/index',
            //     name: 'knowledge',
            //     component: require("cp.knowledge").init(),
            // }
        ]
    });
    
    // 路由器需要一个根组件。
    var App = new Vue({
        created:function(){
        },
        data: function(){
            return {
            }
        },
        router:router,
        created:function () {
          console.log("app create");
        },
        route:{
        },
        events:{
            //接收子组件传来的reflesh事件，并广播到其他子组件
            'reflesh':function(url){
                var self = this;
                self.$broadcast("reflesh",url);
            }
        }
    }).$mount('#root');
    
}