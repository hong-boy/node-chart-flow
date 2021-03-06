<template>
    <div class="dt-editor">
        <div class="dt-palette"></div>
        <div :class="[
            'dt-workspace',
            scrollbarStyle === SCROLLBARS.MAP ? 'is-scroll-page-map':
            scrollbarStyle === SCROLLBARS.NATIVE ? 'is-scroll-native':
            scrollbarStyle === SCROLLBARS.PRETTY ? 'is-scroll-pretty':''
            ]">
            <scrollbar v-if="scrollbarStyle === SCROLLBARS.MAP" @onUpdate="onUpdate4PageMap" @onInit="onInit4PageMap">
                <div slot="pageMap" class="scroll-element_outer">
                    <img id="bg_map" width="100%" height="100%" class="bg-map"/>
                    <div class="scroll-element_size">
                        <div class="scroll-element_track"></div>
                        <div class="scroll-bar"></div>
                    </div>
                </div>
                <div slot="content" class="scrollbar-map">
                    <div class="dt-canvas"></div>
                </div>
            </scrollbar>
            <div v-if="scrollbarStyle === SCROLLBARS.NATIVE" class="dt-canvas"></div>
            <div v-if="scrollbarStyle === SCROLLBARS.PRETTY" class="dt-canvas scrollbar-dynamic" v-bar></div>
            <footer class="dt-footer"></footer>
        </div>
        <div class="divider-line"></div>
        <div class="dt-side-bar">
            <div class="dt-prop-box">
                <component :is="compt.id" :node.sync="compt.node" :editor="editor" ref="prop"></component>
            </div>
            <div class="divider-horizonal"></div>
            <div class="dt-tip-box scrollbar-dynamic" v-bar></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Editor from './Editor.js'
    import Constant from './Constant.js'

    export default {
        name: 'NodeChartFlow',
        props: {
            data: {type:Array, default: []},
            registerNodeType: {type: Function},
            clearPropCompt: {type: Boolean, default:false}, // 清除动态组件，等价于 compt.id=null
            readonly: {type: Boolean, default:false}, // readonly只有在初始化的时候传入才有效
            showTips: {type: Boolean, default:false},
            intervalTips: {type: Number, default: 3000},
            size: {type: Number, default: 5000},
            showGrid: {type: Boolean, default:true},
            gapGrid: {type: Number, default:20},
            strokeColorGrid: {type: String, default:'#eee'},
            scrollbarStyle: {type:String, default:Constant.SCROLLBAR_NATIVE},
        },
        created(){
            let thiz = this;
            let config = {
                readonly: thiz.readonly,
                data: thiz.data,
                settings: {
                    size: thiz.size,
                    scrollbarStyle: thiz.scrollbarStyle,
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
            thiz.$nextTick( async function () {
                thiz.editor = new Editor(thiz.$el, config);
                // thiz.$emit('registerNodeType', thiz.editor);
                // 注册节点类型
                await thiz.registerNodeType(thiz.editor);
                // 注册节点属性组件
                thiz.editor.getNodeTypes().forEach(RealNodeType=>RealNodeType.component());
                // 初始化
                thiz.editor.init();
                // 绑定事件
                thiz.editor.on('added-line', function (args) {
                    thiz.$emit('addedLine', args)
                });
                thiz.editor.on('deleted-line', function (args) {
                    thiz.$emit('deletedLine', args)
                });
                thiz.editor.on('deleted-node', function (args) {
                    thiz.$emit('deletedNode', args)
                });
                thiz.editor.on('added-node', async function ({node}=args) {
                    // 切换视图
                    await thiz.switchPropView(node.datum());
                    thiz.$emit('addedNode', node)
                });
                thiz.editor.on('pasted-node', function ({pastedNodes}=args) {
                    thiz.$emit('pastedNode', pastedNodes)
                });
                thiz.editor.on('on-completed', function () {
                    thiz.$emit('onCompleted', thiz);
                });
                thiz.editor.on('on-reRender-nodes', function (nodes) {
                    thiz.$emit('onReRenderNodes', thiz, nodes);
                });
                thiz.editor.on('clicked-node', async function ({node}=args) {
                    // 切换视图
                    await thiz.switchPropView(node.datum());
                    thiz.$emit('clickedNode', node);
                });
            })
        },
        destroyed(){
            this.editor.destroy();
            window.cancelAnimationFrame(this.timer);
        },
        data(){
            return {
                editor: null, // Editor实例
                scrollbar: null, // page-map滚动条实例
                timer: null, // 定时器引用
                compt: { // 当前要显示的组件
                    id: null,
                    node: null
                },
                SCROLLBARS: {
                    MAP: Constant.SCROLLBAR_MAP,
                    PRETTY: Constant.SCROLLBAR_PRETTY,
                    NATIVE: Constant.SCROLLBAR_NATIVE
                }
            };
        },
        methods: {
            switchPropView(datum){
                // 切换视图
                let thiz = this;
                return new Promise(resolve=>{
                    thiz.compt.id = null;
                    setTimeout(function () {
                        let nodeTypeId = datum.nodeTypeId;
                        thiz.compt.id = nodeTypeId;
                        thiz.compt.node = datum;
                        resolve();
                    }, 10);
                })
            },
            onInit4PageMap(){
                // 开启定时任务刷新page-map
                let thiz = this;
                thiz.timer = setInterval(refreshPageMap.call(thiz), 10000);
            },
            refreshPageMap(){
                let thiz = this;
                let scrollbar = thiz.scrollbar;
                window.requestAnimationFrame(function () {
                    let ret = thiz.getInscribedArea(100, 100, scrollbar.scrollx.size, scrollbar.scrolly.size);
                    scrollbar.scrollx.scroll.style.width = `${ret.w}px`;
                    scrollbar.scrolly.scroll.style.height = `${ret.h}px`;
                    setTimeout(async function () {
                        let data = await thiz.editor.screenshot();
                        document.querySelector('#bg_map').src = data;
                    }, 1);
                });
            },
            onUpdate4PageMap(scrollbar, container){
                let thiz = this;
                thiz.scrollbar = scrollbar;
                thiz.refreshPageMap(scrollbar);
            },
            /**
             * Get inscribed area size
             *
             * @param int oW outer width
             * @param int oH outer height
             * @param int iW inner width
             * @param int iH inner height
             * @param bool R resize if smaller
             */
            getInscribedArea (oW, oH, iW, iH, R){
                if(!R && iW < oW && iH < oH){
                    return {
                        "h": iH,
                        "w": iW
                    };
                }
                if((oW / oH) > (iW / iH)){
                    return {
                        "h": oH,
                        "w": Math.round(oH * iW / iH)
                    }
                } else {
                    return {
                        "h": Math.round(oW * iH / iW),
                        "w": oW
                    };
                }
            },
        },
        watch: {
            clearPropCompt(val, oldVal){
                if(val){
                    this.compt.id = null;
                }
            }
        }
    }
</script>
