<template>
    <div class="dt-editor">
        <div class="dt-palette"></div>
        <div class="dt-workspace">
            <div class="dt-canvas"></div>
            <footer class="dt-footer"></footer>
        </div>
        <div class="dt-helper">helper</div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Editor from './Editor.js'

    export default {
        name: 'NodeChartFlow',
        props: {
            registerNodeType: {type: Function},
        },
        created(){
            let thiz = this;
            let config = {};
            thiz.$nextTick(function () {
                thiz.editor = new Editor(thiz.$el, config);
                thiz.$emit('registerNodeType', thiz.editor);
                thiz.editor.init();
            })
        },
        destroyed(){
            this.editor.destroy();
        },
        data(){
            return {
                editor: {},
            };
        }
    }
</script>

<style lang="less" src="./css/main.less"></style>
