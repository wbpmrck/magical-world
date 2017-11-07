
/*
    一个用于展示数值的组件
    1、value表示当前数值
    2、totalValue表示bar满的时候，最大值
    3、text表示数值左侧的文本
    4、color:前景色
    5、bgColor:背景色
 */

module.exports={
    DataBar:Vue.component('data-bar', {
        template: __inline("data-bar.html"),
        props:["text","value","totalValue","color","bgColor"],
        data: function () {
            return {
            }
        },
        computed: {
          width:function () {
              return parseInt( ( (this.$props.value<0?0:this.$props.value)/this.$props.totalValue) *100)+'%'
          }
        },
        created:function () {
        
        }
    })
}