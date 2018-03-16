<template>
    <el-row class="source-node-type">
        <el-row class="source-box scrollbar-dynamic" v-bar>
            I m source type... {{node.nodeTypeId}}
        </el-row>
    </el-row>
</template>

<script type="text/ecmascript-6">
    export default {
        props: ['node'],
        data(){
            return {};
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
