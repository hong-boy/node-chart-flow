<template>
    <div class="dt-editor">
        <div class="dt-palette"></div>
        <div class="dt-workspace">
            <div class="dt-canvas"></div>
            <footer class="dt-footer"></footer>
        </div>
        <div class="dt-helper">helper</div>
        <svg>
            <g class="inner-canvas">
                <rect class="dt-c-bg"></rect>
                <g class="dt-c-grid">
                    <line class="horizonal"></line>
                    <line class="vertical"></line>
                </g>
                <g class="dt-link"></g>
                <g class="dt-node">
                    <rect class="node-rect"></rect>
                    <g class="node-icon-group">
                        <rect class="shape"></rect>
                        <span class="icon"></span>
                        <path class="shape-border"></path>
                    </g>
                    <text class="node-label"></text>
                    <g class="node-status-group">
                        <span class="status error"></span>
                        <span class="status changed"></span>
                    </g>
                    <g class="port inputs">
                        <rect class="node-port"></rect>
                    </g>
                    <g class="port outputs">
                        <rect class="node-port"></rect>
                    </g>
                </g>
            </g>
        </svg>
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

<style lang="pcss" src="./css/palette.pcss"></style>
<style lang="pcss" src="./css/editor2.pcss"></style>
