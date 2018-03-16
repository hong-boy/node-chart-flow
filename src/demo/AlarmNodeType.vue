<template>
    <el-row class="alarm-node-type">
        <el-row class="alarm-box scrollbar-dynamic" v-bar>
            I m alarm type... {{node.nodeId}}
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
    .alarm-node-type {
        .alarm-box {
            max-height: 300px !important;
        }
    }
</style>
