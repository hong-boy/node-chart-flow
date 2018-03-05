'use strict';
import $ from 'jquery'
import NodeType from './NodeType.js'
import util from './ViewUtil.js'
import Constant from './Constant.js'

/**
 * 默认编辑器配置
 */
const DEFAULT_CONFIG = {
    isReadonlyMode: false, // 是否启用只读模式（不允许拖动节点、删除节点、删除连线）
    // 节点实例
    data: [],
    settings: {
        size: 5000,
        showHelpDialog: true,
        grid: {
            enable: true,
            gap: 20,
            strokeColor: '#eee'
        }
    },
};

// 属性对话框事件
const PROP_DIALOG_EVENTS = {
    ON_READY: 'on-ready', // 属性对话框显示后触发的事件
    ON_DELETE: 'on-delete', // 属性对话框点击删除按钮
    ON_CANCEL: 'on-cancel', // 属性对话框点击取消按钮
    ON_SAVE: 'on-save', // 属性对话框点击保存按钮
    ON_RESIZE: 'on-resize', // 属性对话框尺寸调整
};

// 编辑器快捷键
const SHORTCUTS = {

};

class Editor {
    /**
     * 构造器
     * @param el 依附的容器节点
     * @param config 编辑器的配置
     */
    constructor(el, config){
        this._debug = true; // 用于打印关键信息方便调试
        this.config = $.extend(true, {}, DEFAULT_CONFIG, config);
        this.$el = $(el);
        this.$palette = this.$el.find('.dt-palette');
        this.$workspace = this.$el.find('.dt-workspace');
        this.$canvas = this.$workspace.find('.dt-canvas').attr('id', Constant.CANVAS_ID);
        this.$helper = this.$el.find('.dt-helper');
        this.___svg = null; // 存放d3生成的svg实例
        this.___def = {
            NodeCatagory: new Set(), // 节点类别
            NodeTypes: new Map(), // 节点类型模板类
            Relations: new Map(), // 节点连线
        };
    }
    init(){
        let thiz = this;
        let config = thiz.config;
        // 注册节点类型
        if(!thiz.getNodeTypes().size){
            throw Error('请先注册节点类型：registerNodeType()');
        }
        // 绘制dt-palette
        util.renderPalette(thiz);
        // 绘制dt-workspace
        util.renderWorkspace(thiz);

    }
    update(){

    }
    destroy(){

    }
    exportData(){

    }
    importData(){

    }
    fullScreen(){

    }
    restoreScreen(){

    }
    showPropDialog(){

    }
    hidePropDialog(){

    }
    zoom(){

    }
    registerCatagory(cata){
        // 注册节点类别
        let catagory = this.getNodeCatagory();
        catagory.add({
            id: cata.id,
            label: cata.label||cata.id
        });
    }
    registerNodeType(func){
        // 注册节点类型模板
        let RealNodeType = func.call(null, NodeType);
        this.___def.NodeTypes.set(RealNodeType.id(), RealNodeType);
    }
    getNodeCatagory(){
        // 返回注册的节点类别
        let set = this.___def.NodeCatagory;
        if(!set.size){
            // 若catagory为空，则默认添加一个类别
            set.add(Constant.DEFAULT_CATAGORY);
        }
        return set;
    }
    getNodeTypes(){
        // 返回已注册的节点类型
        return this.___def.NodeTypes;
    }
    log(...msg){
        if(this._debug){
            console.log(msg);
        }
    }
    _setSVG(svg){
        this.___svg = svg;
    }
    getSVG(){
        return this.___svg;
    }
    _setRelation(from, to, line, id){
        this.___def.Relations.set(id, {
            id: id,
            from: from,
            to: to,
            line: line,
        });
        return id;
    }
    _removeRelation(id){
        this.___def.Relations.delete(id);
    }
    getRelations(){
        return this.___def.Relations;
    }
}

export default Editor;
