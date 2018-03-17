<template>
    <div class="wrapper">
        <node-chart-flow
            @registerNodeType="registerNodeType"
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
    import SourceNodeType from './SourceNodeType'
    import TransformNodeType from './TransformNodeType'
    import StatsNodeType from './StatsNodeType'
    import AlarmNodeType from './AlarmNodeType'

    export default {
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
            registerNodeType(editor){
                // 注册节点类型
                editor.registerNodeType(()=>SourceNodeType);
                editor.registerNodeType(()=>TransformNodeType);
                editor.registerNodeType(()=>StatsNodeType);
                editor.registerNodeType(()=>AlarmNodeType);
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
