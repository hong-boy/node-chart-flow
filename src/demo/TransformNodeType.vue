<template>
    <el-row class="trans-node-type">
        <el-row class="trans-box scrollbar-dynamic" v-bar>
            I m trans type... {{node.nodeId}}
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
    .trans-node-type {
        .trans-box {
            max-height: 300px !important;
        }
    }
</style>
