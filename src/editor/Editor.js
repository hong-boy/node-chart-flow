'use strict';
import * as d3 from 'd3'
import $ from 'jquery'
import Node from './Node.js'
import util from './Util.js'

/**
 * 默认编辑器配置
 */
const DEFAULT_CONFIG = {
    debug: true, // 用于打印关键信息方便调试
    isReadonlyMode: false, // 是否启用只读模式（不允许拖动节点、删除节点、删除连线）
    palette: {
        catagory: { // 节点所属类别 PS：这里是节点类别，不是节点类型（节点类别下面可以有多中不同的节点类型）
            list: [{
                id: 'defaults',
                label: 'Defaults'
            }]
        },
        nodeType: [{ // 定义节点类型模板
            catagory: 'defaults', // 节点所属类别ID
            nodeTypeId: 'alarmNode', // 节点类型唯一表示
            label: function(){return this.props.tblName||'alarm1'}, // 节点label（可以为string或者function，this指代当前节点实例）
            inputs: {
                enable: true, // 是否允许有数据源输入
                max: 1, // 最多允许的数据源数量：n-允许有n个输入（默认：n=1）
                tip: '告警节点只允许有一个输入...', // 鼠标悬停在输入端口按钮时显示的信息
            },
            outputs: {
                enable: false,
            },
            color: 'rgb(216, 191, 216)', // 节点背景色
            icon: null, // 节点图标

            props: {
                id: '', // 数据库端生成的ID
                name: '', // 表名
                sources: [], // 数据源
                desc: '', // 描述
                isStorage: 0, // 是否存储
                scripts: {}, // 告警规则脚本
                expression: '', // 告警表达式（用于前端展示）
                fields: [{
                    fieldId: null,
                    fieldName: '',
                    fieldType: 1,
                    fieldDesc: '',
                    isNew: true, // 是否为新节点
                    isFixed: true, // 是否为固定字段
                }],
            },
        }, { // 定义节点类型模板
            catagory: 'defaults', // 节点所属类别ID
            nodeTypeId: 'alarmNode2', // 节点类型唯一表示
            label: function(){return this.props.tblName||'alarm2'}, // 节点label（可以为string或者function，this指代当前节点实例）
            inputs: {
                enable: true, // 是否允许有数据源输入
                max: 1, // 最多允许的数据源数量：n-允许有n个输入（默认：n=1）
                tip: '告警2节点只允许有一个输入...', // 鼠标悬停在输入端口按钮时显示的信息
            },
            outputs: {
                enable: true,
                max: 1,
            },
            color: 'rgb(228, 145, 145)', // 节点背景色
            icon: null, // 节点图标

            props: {},
        }],
    },
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
        this.config = $.extend(true, {}, DEFAULT_CONFIG, config);
        this.$el = $(el);
        this.$palette = this.$el.find('.dt-palette');
        this.$canvas = this.$el.find('.dt-canvas');
        this.$helper = this.$el.find('.dt-helper');
        this.___def = {
            nodeType: new Map()
        };
    }
    init(){
        let thiz = this;
        let config = thiz.config;
        // 注册节点类型
        if(!(Array.isArray(config.palette.nodeType) && config.palette.nodeType.length)){
            throw Error('nodeType为空：请先配置节点类型');
        }
        config.palette.nodeType.forEach(nodeType=>{
            thiz.registerNodeType(nodeType.nodeTypeId, new Node(nodeType));
        });
        // 绘制dt-palette
        util.renderPalette(thiz);

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
    registerNodeType(nodeTypeId, config){
        // 注册节点类型
        this.___def.nodeType.set(nodeTypeId, config);
    }
    getNodeType(){
        return this.___def.nodeType;
    }
}

export default Editor;
