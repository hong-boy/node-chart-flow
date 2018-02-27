<template>
    <div class="wrapper">
        <node-chart-flow @registerNodeType="registerNodeType"></node-chart-flow>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data(){
            return {};
        },
        methods: {
            registerNodeType(editor){
                let nodeTypeConfig = {
                    catagory: 'defaults',
                    nodeTypeId: 'transform',
                    label: function(){return this.props.tblName||'transform'},
                    inputs: {
                        enable: true,
                        max: 1,
                        tip: '转换节点只允许有一个输入...',
                    },
                    outputs: {
                        enable: true,
                        max: 1,
                    },
                    color: 'rgb(176, 223, 227)', // 节点背景色
                    icon: null, // 节点图标
                    props: {}
                };
                // TODO - nodeTypeHtml
                // TODO - nodeTypeHelper
                editor.registerNodeType('transform', nodeTypeConfig)
            },
        },
    }
</script>

<style lang="less">
    .wrapper {
        width: 85%;
        height: ~"calc(100vh - 90px)";
        border: 1px solid #eee;
        margin: 30px auto;
    }
</style>
