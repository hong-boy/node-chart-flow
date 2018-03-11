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
                // Source
                editor.registerNodeType(function (NodeType) {
                    return class SourceNodeType extends  NodeType {
                        static id(){
                            return 'sourceNode'
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
                        constructor(){
                            super();
                            this.icon = null;
                            this.props = {};
                            this.nodeTypeId = TransformNodeType.id();
                            this.color = 'rgb(176, 223, 227)';
                            this.label = function (editor) {
//                                return 'transformtransformNodetransformNode';
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
