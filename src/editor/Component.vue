<template>
    <div class="df-editor">
        <div class="dt-sidebar"></div>
        <div class="dt-canvas"></div>
        <div class="dt-helper"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Editor from './Editor.js'

    export default {
        created(){
            let thiz = this;
            let config = {};
            this.editor = new Editor(thiz.$el, config);
        },
        data(){
            return {
                editor: null,
            };
        }
    }
</script>

<style lang="less"></style>
