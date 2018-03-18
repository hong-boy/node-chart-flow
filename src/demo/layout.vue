<template>
    <div class="wrapper">
        <node-chart-flow
            :registerNodeType="registerNodeType"
            :data="nodes"
            scrollbarStyle="native"
            :showGrid="true"
            :readonly="false"
            @clickedNode="clickedNode"
            @addedNode="addedNode"
            @addedLine="addedLine"
            @deletedNode="deletedNode"
            @deletedLine="deletedLine"
            :showTips="false"></node-chart-flow>
    </div>
</template>

<script type="text/ecmascript-6">

    export default {
        // components: {
        //     'node-chart-flow': resolve=>require(['../../dist/bundle.js'], resolve)
        // },
        data(){
            return {
                nodes: require('./data.json')
            };
        },
        methods: {
            clickedNode(args){
                console.log('clickedNode', args);
            },
            addedNode({node}=args){
                console.log('addedNode', node.datum());
            },
            addedLine(){},
            deletedNode(){},
            deletedLine(){},
            async registerNodeType(editor){
                // 注册节点类型
                await editor.registerNodeType(function () {
                    return new Promise(resolve=>require(['./SourceNodeType'], resolve));
                });
                await editor.registerNodeType(function () {
                    return new Promise(resolve=>require(['./TransformNodeType'], resolve));
                });
                await editor.registerNodeType(function () {
                    return new Promise(resolve=>require(['./StatsNodeType'], resolve));
                });
                await editor.registerNodeType(function () {
                    return new Promise(resolve=>require(['./AlarmNodeType'], resolve));
                });
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
