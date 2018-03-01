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
                editor.registerNodeType(function (NodeType) {
                    class TransformNodeType extends  NodeType {
                        constructor(){
                            super();
                            this.icon = null;
                            this.props = {};
                            this.nodeTypeId = 'transformNode';
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
                    }
                    TransformNodeType.id = 'transformNode';
                    return TransformNodeType;
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
