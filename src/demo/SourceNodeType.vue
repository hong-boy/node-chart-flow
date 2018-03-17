<template>
    <el-row class="source-node-type">
        <el-row class="source-box">
            <el-form
                :model="node.props"
                :rules="rules"
                :ref="node.nodeId"
                label-width="100px"
                class="form">
                <el-form-item label="数据流名称" prop="name">
                    <el-input v-model="node.props.name"></el-input>
                </el-form-item>
            </el-form>
        </el-row>
    </el-row>
</template>

<script type="text/ecmascript-6">
    export default {
        props: ['node'],
        data(){
            return {
                rules: {
                    name: {}
                }
            };
        }
    }
</script>

<style lang="less">
    .source-node-type {
        .source-box {
            max-height: 300px !important;
        }
    }
</style>
