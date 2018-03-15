<template>
    <div class="wrapper">
        <node-chart-flow
            @registerNodeType="registerNodeType"
            :data="nodes"
            :showGrid="true"
            :readonly="false"
            @clickedNode="clickedNode"
            @addedNode="addedNode"
            @addedLine="addedLine"
            @deletedNode="deletedNode"
            @deletedLine="deletedLine"
            :showTips="true"></node-chart-flow>
    </div>
</template>

<script type="text/ecmascript-6">
    const NODE_DESC = {
        ALARM: [
            '数据告警节点 根据用户自定义的告警处理逻辑将符合条件的数据存储到.....'
        ].join('')
    };
    const DATA_NODES = [{
        "nodeId": "dt-67491d55-fda6-46d2-b023-7d1fddce3fe8",
        "x": 131,
        "y": 138,
        "catagory": "defaults",
        "nodeTypeId": "sourceNode",
        "prev": [],
        "next": ["dt-5ab061bb-887a-452e-aeb5-67834c794684"],
        "inputs": {"enable": false},
        "outputs": {"enable": true, "tip": "描述..."},
        "color": "#A6BBCE",
        "label": "source",
        "icon": null,
        "props": {}
    }, {
        "nodeId": "dt-21f30704-dbd9-4aa3-a68d-f3af6c61b85f",
        "x": 674,
        "y": 248,
        "catagory": "defaults",
        "nodeTypeId": "alarmNode",
        "prev": ["dt-5ab061bb-887a-452e-aeb5-67834c794684"],
        "next": [],
        "inputs": {"enable": true, "max": 1, "tip": "描述..."},
        "outputs": {"enable": false},
        "color": "#E59191",
        "label": "alarmNode",
        "icon": "33f3b78b520aed951835baa59bad0ceb.png",
        "props": {}
    }, {
        "nodeId": "dt-5ab061bb-887a-452e-aeb5-67834c794684",
        "x": 379,
        "y": 192,
        "catagory": "defaults",
        "nodeTypeId": "transformNode",
        "prev": ["dt-67491d55-fda6-46d2-b023-7d1fddce3fe8"],
        "next": ["dt-21f30704-dbd9-4aa3-a68d-f3af6c61b85f"],
        "inputs": {"enable": true, "max": 1, "tip": "描述..."},
        "outputs": {"enable": true, "max": 1, "tip": "描述..."},
        "color": "rgb(176, 223, 227)",
        "icon": null,
        "props": {}
    }];
    export default {
        data(){
            return {
                nodes: DATA_NODES
            };
        },
        methods: {
            clickedNode(){},
            addedNode({node}=args){
                console.log('addedNode', node.datum());
            },
            addedLine(){},
            deletedNode(){},
            deletedLine(){},
            registerNodeType(editor){
                // Source
                editor.registerNodeType(function (NodeType) {
                    return class SourceNodeType extends  NodeType {
                        static id(){
                            return 'sourceNode'
                        }
                        validate(from, to, editor){
                            return true;
                        }
                        constructor(){
                            super();
                            this.props = {};
                            this.nodeTypeId = SourceNodeType.id();
                            this.color = '#A6BBCE';
                            this.label = 'source';
                            this.outputs = {
                                enable: true,
                                tip: '描述...'
                            };
                            this.inputs = {
                                enable: false,
                            };
                        }
                    };
                });
                // Transform
                editor.registerNodeType(function (NodeType) {
                    return class TransformNodeType extends  NodeType {
                        static id(){
                            return 'transformNode'
                        }
                        validate(from, to, editor){
                            let flag = true;
                            editor.getRelations().forEach(lineItem=>{
                                if(lineItem.to.node() === to.node()){
                                    // 只允许有一个输入
                                    flag = false;
                                }
                            });
                            return flag;
                        }
                        constructor(){
                            super();
                            this.icon = null;
                            this.props = {};
                            this.nodeTypeId = TransformNodeType.id();
                            this.color = 'rgb(176, 223, 227)';
                            this.label = function (editor) {
                                return 'transform';
                            };
                            this.inputs = {
                                enable: true,
                                max: 1,
                                tip: '描述...'
                            };
                            this.outputs = {
                                enable: true,
                                max: 1,
                                tip: '描述...'
                            };
                        }
                    };
                });
                // Alarm
                editor.registerNodeType(function (NodeType) {
                    return class AlarmNodeType extends  NodeType {
                        static id(){
                            return 'alarmNode'
                        }
                        static tip(){
                            return NODE_DESC.ALARM;
                        }
                        validate(from, to, editor){
                            let flag = true;
                            editor.getRelations().forEach(lineItem=>{
                                console.log(lineItem.to, to, lineItem.to === to);
                                if(lineItem.to.node() === to.node()){
                                    // 只允许有一个输入
                                    flag = false;
                                }
                            });
                            return flag;
                        }
                        constructor(){
                            super();
                            this.props = {};
                            this.nodeTypeId = AlarmNodeType.id();
                            this.icon = require('./alert.png');
                            this.color = '#E59191';
                            this.label = 'alarmNode';
                            this.inputs = {
                                enable: true,
                                max: 1,
                                tip: '描述...'
                            };
                            this.outputs = {
                                enable: false,
                            };
                        }
                    };
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
