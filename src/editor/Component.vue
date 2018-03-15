<template>
    <div class="dt-editor">
        <div class="dt-palette"></div>
        <div class="dt-workspace">
            <div class="dt-canvas scrollbar-dynamic" v-bar></div>
            <footer class="dt-footer"></footer>
        </div>
        <div class="divider-line"></div>
        <div class="dt-side-bar">
            <div class="dt-prop-box scrollbar-dynamic" v-bar></div>
            <div class="divider-horizonal"></div>
            <div class="dt-tip-box scrollbar-dynamic" v-bar></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Editor from './Editor.js'

    export default {
        name: 'NodeChartFlow',
        props: {
            data: {type:Array, default: []},
            registerNodeType: {type: Function},
            readonly: {type: Boolean, default:false}, // readonly只有在初始化的时候传入才有效
            showTips: {type: Boolean, default:true},
            intervalTips: {type: Number, default: 3000},
            size: {type: Number, default: 5000},
            showGrid: {type: Boolean, default:true},
            gapGrid: {type: Number, default:20},
            strokeColorGrid: {type: String, default:'#eee'},
        },
        created(){
            let thiz = this;
            let config = {
                readonly: thiz.readonly,
                data: thiz.data,
                settings: {
                    size: thiz.size,
                    tips: {
                        enable: thiz.showTips,
                        interval: thiz.intervalTips
                    },
                    grid: {
                        enable: thiz.showGrid,
                        gap: thiz.gapGrid,
                        strokeColor: thiz.strokeColorGrid,
                    },
                }
            };
            thiz.$nextTick(function () {
                thiz.editor = new Editor(thiz.$el, config);
                // window.editor = thiz.editor;
                thiz.$emit('registerNodeType', thiz.editor);
                thiz.editor.init();
                thiz.editor.on('added-line', function (...args) {
                    thiz.$emit('addedLine', args)
                });
                thiz.editor.on('deleted-line', function (...args) {
                    thiz.$emit('deletedLine', args)
                });
                thiz.editor.on('deleted-node', function (...args) {
                    thiz.$emit('deletedNode', args)
                });
                thiz.editor.on('added-node', function (args) {
                    thiz.$emit('addedNode', args)
                });
                thiz.editor.on('clicked-node', function (...args) {
                    thiz.$emit('clickedNode', args)
                });
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
