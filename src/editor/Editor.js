'use strict';
import * as d3 from 'd3'
import merge from 'lodash.merge'

/**
 * 默认编辑器配置
 */
const DEFAULT_CONFIG = {
    debug: true, // 用于打印关键信息方便调试
    isReadonlyMode: false, // 是否启用只读模式（不允许拖动节点、删除节点、删除连线）
    nodes: [{ // 定义节点模板

    }],
    data: [{ // 节点实例

    }],
    settings: {
        width: 5000,
        height: 5000,
        showHelpDialog: true,
        grid: {
            enable: true,
            gap: 20,
            strokeColor: '#ddd'
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
        this.config = merge({}, DEFAULT_CONFIG, config);
        this.el = el;

    }
    init(){

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
}

export default Editor;
