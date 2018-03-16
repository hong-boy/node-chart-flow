<template>
    <el-row class="stats-node-type">
        <el-row class="stats-box scrollbar-dynamic" v-bar>
            I m stats type... {{node.nodeId}}
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
    .stats-node-type {
        .stats-box {
            max-height: 300px !important;
        }
    }
</style>
