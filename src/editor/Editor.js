'use strict';
import $ from 'jquery';
import * as d3 from 'd3';
import NodeType from './NodeType.js';
import util from './ViewUtil.js';
import SaveSVGAsPNG from 'save-svg-as-png';
import Constant from './Constant.js';
import Events from 'events';

/**
 * 默认编辑器配置
 */
const DEFAULT_CONFIG = {
    readonly: false, // 是否启用只读模式（不允许拖动节点、删除节点、删除连线）
    // 节点实例
    data: [],
    settings: {
        size: 5000,
        scrollbarStyle: 'page-map', // 滚动条风格 - map:pageMap native:原生 pretty:简约风格
        tips: {
            enable: true, // 是否启用tips功能
            interval: 3000, // tip显示间隔
        },
        grid: {
            enable: true,
            gap: 20,
            strokeColor: '#eee',
        },
    },
};


class Editor extends Events {
    /**
     * 构造器
     * @param el 依附的容器节点
     * @param config 编辑器的配置
     */
    constructor(el, config) {
        super();
        this._debug = false; // 用于打印关键信息方便调试
        this.config = $.extend(true, {}, DEFAULT_CONFIG, config);

        this.$el = $(el);
        this.$palette = this.$el.find('.dt-palette');
        this.$workspace = this.$el.find('.dt-workspace');
        this.$divider = this.$el.find('.divider-line');
        this.$sidebar = this.$el.find('.dt-side-bar');
        this.$canvas = this.$workspace.find(
            config.settings.scrollbarStyle === Constant.SCROLLBAR_PRETTY ?
            '.dt-canvas .dt-canvas' : '.dt-canvas'
        );
        this.$canvas.attr('id', Constant.CANVAS_ID);

        this.___svg = null; // 存放d3生成的svg实例
        this.___def = {
            NodeCatagory: new Set(), // 节点类别
            NodeTypes: new Map(), // 节点类型模板类
            Relations: new Map(), // 节点连线
            CopyedNodes: new Set(), // 被复制的节点
            scaleFactor: 1, // 缩放因子
            tips: new Set(), // 存放说明描述信息(支持html格式)
        };
    }

    init() {
        let thiz = this;
        let config = thiz.config;
        // 注册节点类型
        if (!thiz.getNodeTypes().size) {
            throw Error('请先注册节点类型：registerNodeType()');
        }
        thiz.log(config);
        thiz.log(thiz.getNodeTypes());
        config.readonly && thiz.$el.addClass('is-readonly');
        // 绘制dt-palette
        util.renderPalette(thiz);
        // 绘制dt-workspace
        util.renderWorkspace(thiz);
        // 渲染divider-horizional
        util.renderDividerHorizonal(thiz);
        util.renderTipBox(thiz);
        setTimeout(function () {
            // 绘制节点
            config.data.map((node) => {
                node.isChanged = false;
                node.isErrored = false;
                return node;
            });
            thiz.importData(config.data, false, false);
        }, 10);
    }

    destroy() {
        this.config = null;
        this.___def.CopyedNodes.clear();
        this.___def.NodeCatagory.clear();
        this.___def.NodeTypes.clear();
        this.___def.Relations.clear();
        this.___def.tips.clear();
        this.___def = null;
        this.___svg = null;
    }

    /**
     * 生成当前画布截图
     */
    screenshot() {
        let thiz = this;
        return new Promise((resolve, reject) => {
            let settings = thiz.config.settings;
            let $svg = thiz.$canvas.find('svg').clone();
            $svg.find('g.dt-c-grid').remove();
            let width = parseInt($svg.attr('width'));
            let scale = width / settings.size;
            SaveSVGAsPNG.svgAsPngUri($svg.get(0), { scale, }, function (uri) {
                resolve(uri);
            });
        });
    }

    /**
     * 导出全部节点（深克隆）
     * @return {Array}
     */
    exportData() {
        let list = util.exportData(this);
        this.log(list);
        return list;
    }

    /**
     * 导入
     * @param{Array} list - 数据格式请参考exportData方法的返回值
     * @param{Boolean} selected - 是否选中导入的节点
     * @param{Boolean} fresh - 是否创建新的uuid
     */
    importData(list, selected = true, fresh = true) {
        util.importData(list, this, selected, fresh);
    }

    /**
     * 是否是只读模式
     * PS： 只读模式下，无法对画布节点进行拖拽、删除、新增，只能触发click操作
     */
    isReadonly() {
        return this.config.readonly;
    }

    /**
     * 缩放
     * @param{Number} factor - 取值区间[0.4, 2]
     */
    zoom(factor) {
        util.zoom(this, factor);
    }

    /**
     * 注册节点类别
     * PS：节点类别是指dt-pallete面板所对应的区域
     * 默认值：{id:defaults, label:Defaults}
     * @param cata
     */
    registerCatagory(cata) {
        let catagory = this.getNodeCatagory();
        catagory.add({
            id: cata.id,
            label: cata.label || cata.id,
        });
    }

    /**
     * 注册节点类型
     * PS：func函数会传入NodeType类作为参数，用户必须继承该类
     * @param func
     * @returns {Promise<void>}
     */
    async registerNodeType(func) {
        // 注册节点类型模板
        let RealNodeType = await func.call(null, NodeType);
        if (RealNodeType.__esModule) {
            RealNodeType = RealNodeType.default;
        }
        this.___def.NodeTypes.set(RealNodeType.id(), RealNodeType);
    }

    /**
     * 获取节点类别
     * @return {Set}
     */
    getNodeCatagory() {
        // 返回注册的节点类别
        let set = this.___def.NodeCatagory;
        if (!set.size) {
            // 若catagory为空，则默认添加一个类别
            set.add(Constant.DEFAULT_CATAGORY);
        }
        return set;
    }

    /**
     * 根据节点类型ID获取节点类型模板类
     * @param id
     */
    getNodeTypeById(id) {
        return this.getNodeTypes().get(id);
    }

    /**
     * 获取节点类型模板类
     * @return {Map}
     */
    getNodeTypes() {
        // 返回已注册的节点类型
        return this.___def.NodeTypes;
    }

    /**
     * 打印日志（内部使用）
     * @param msg
     */
    log(...msg) {
        this._debug && console.log(msg);
    }

    _setSVG(svg) {
        this.___svg = svg;
    }

    /**
     * 获取当前svg元素
     * @return {null|*}
     */
    getSVG() {
        return this.___svg;
    }

    /**
     * 检测是否存在环
     */
    checkCircular() {
        // TODO 判断图中是否有环
    }

    _setRelation(from, to, line, id) {
        this.___def.Relations.set(id, {
            id,
            from,
            to,
            line,
        });
        return id;
    }

    _removeRelation(id) {
        this.___def.Relations.delete(id);
    }

    _getRelation(id) {
        return this.___def.Relations.get(id);
    }

    getRelations() {
        return this.___def.Relations;
    }


    _setCopyedNodes(nodes) {
        this.___def.CopyedNodes = new Set(nodes);
    }

    /**
     * 获取当前被复制的节点
     * @return {Set}
     */
    getCopyedNodes() {
        return this.___def.CopyedNodes;
    }

    /**
     * 设置缩放等级
     * @param{Number} factor - 取值范围[0.4, 2]
     */
    setScaleFactor(factor) {
        this.___def.scaleFactor = Math.max(Math.min(factor, 2), 0.4);
    }

    /**
     * 获取缩放等级
     * @return {number}
     */
    getScaleFactor() {
        return this.___def.scaleFactor;
    }

    /**
     * 添加提示信息
     * @param tip
     */
    setTip(tip) {
        this.___def.tips.add(`<p class="dt-tip">${tip}</p>`);
    }

    getTips() {
        return this.___def.tips;
    }

    /**
     * 更新节点画布中节点的label
     * @param nodeId
     * @param label
     */
    updateNodeLabel(nodeId, label) {
        util.updateNodeLabel(this, nodeId, label);
    }

    updateNodeProps(nodeId, props) {
        let thiz = this;
        let node = thiz.getSVG().select(`#${nodeId}`);
        let datum = node.datum();
        datum.props = props;
    }

    /**
     * 更加节点类型获取节点列表
     * @param nodeTypeId
     */
    getNodeListByNodeType(nodeTypeId) {
        let thiz = this;
        let nodeList = thiz.getSVG().selectAll(`.${Constant.SVG_DT_NODE}`).nodes();
        let list = [];
        nodeList.forEach((item) => {
            let datum = d3.select(item).datum();
            if (datum.nodeTypeId === nodeTypeId) {
                list.push(datum);
            }
        });
        return list;
    }

    getNodeDatumById(nid){
        // 根据nodeId获取datum
        if(nid){
            let node = this.getSVG().select(`#${nid}`).node();
            return d3.select(node).datum();
        }
    }
}

export { NodeType, Editor as default, };
