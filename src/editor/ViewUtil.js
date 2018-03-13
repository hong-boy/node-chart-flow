'use strict';
import * as d3 from 'd3';
import $ from 'jquery';
import uuid from 'uuid/v4';
import 'jquery-ui/ui/widgets/accordion.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/droppable.js';
import 'jquery-ui/themes/base/accordion.css';
import 'jquery-ui/themes/base/draggable.css';
import Constant from './Constant.js';

class ViewUtil {
    static uuid() {
        // 生成uuid
        return uuid();
    }

    static getNodeTpl4SVG(nodeTypeConfig, editor) {
        // .dt-canvas
        /* <g class="dt-node" id="">
         <rect class="node-rect"></rect>
         <g class="node-icon-group">
         <rect class="shape"></rect>
         <image class="icon"></image>
         <path class="shape-border"></path>
         </g>
         <text class="node-label"></text>
         <g class="port inputs">
         <rect class="node-port"></rect>
         </g>
         <g class="port outputs">
         <rect class="node-port"></rect>
         </g>
         <rect class="node-status error"></rect>
         <rect class="node-status changed"></rect>
         </g> */
        let g = editor.getSVG().select(`.${Constant.SVG_DT_NODE_GROUP}`);
        let g4node = g.append('svg:g').attr('class', Constant.SVG_DT_NODE).attr('id', nodeTypeConfig.nodeId);
        // rect.node-rect
        g4node.append('svg:rect')
            .attr('class', 'node-rect')
            .attr('tabindex', -1)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('width', 140) // TODO - width=140
            .attr('height', 30)
            .attr('fill', nodeTypeConfig.color);
        // g.node-icon-group
        let g4icons = g4node.append('svg:g')
            .attr('class', 'node-icon-group')
            .attr('x', 0)
            .attr('y', 0)
            .style('pointer-events', 'none');
        g4icons.append('svg:rect')
            .attr('class', 'shape')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 30)
            .attr('height', 30)
            .attr('fill', '#000')
            .attr('stroke', 'none')
            .attr('fill-opacity', 0.05);
        g4icons.append('image')
            .attr('x', 5)
            .attr('y', 0)
            .attr('width', 20)
            .attr('height', 30)
            .attr('href', `${nodeTypeConfig.icon || require('./css/icon/default.png')}`);
        g4icons.append('svg:path')
            .attr('class', 'shape-border')
            .attr('d', 'M 30 1 l 0 28')
            .attr('stroke-opacity', 0.1)
            .attr('stroke-width', 1)
            .attr('stroke', '#000');
        // text.node-label
        g4node.append('svg:text')
            .attr('class', 'node-label')
            .attr('x', 38)
            .attr('y', 14)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'start')
            .text($.isFunction(nodeTypeConfig.label) ? nodeTypeConfig.label.call(null, editor) : nodeTypeConfig.label);
        // g.port.inputs
        nodeTypeConfig.inputs.enable && g4node.append('svg:g')
            .attr('class', 'port inputs')
            .append('svg:rect')
            .attr('class', 'node-port node-port-input')
            .attr('rx', 3)
            .attr('ry', 3)
            .attr('width', 10)
            .attr('height', 10);
        // g.port.outputs
        nodeTypeConfig.outputs.enable && g4node.append('svg:g')
            .attr('class', 'port outputs')
            .append('svg:rect')
            .attr('class', 'node-port node-port-output')
            .attr('rx', 3)
            .attr('ry', 3)
            .attr('width', 10)
            .attr('height', 10);
        // span.node-status.error
        g4node.append('svg:rect')
            .attr('fill', Constant.DEFAULT_NODE_STATUS_ERROR_COLOR)
            .attr('width', 8)
            .attr('height', 8)
            .attr('y', -4)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('class', 'node-status error hide');
        // span.node-status.changed
        g4node.append('svg:rect')
            .attr('fill', Constant.DEFAULT_NODE_STATUS_CHANGED_COLOR)
            .attr('width', 8)
            .attr('height', 8)
            .attr('y', -4)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('class', 'node-status changed');

        return g4node;
    }

    static getNodeTpl4Palette(nodeTypeConfig, editor) {
        // 获取节点html模板 - .dt-palette
        let $tpl = $(
            '<div class="node-tpl">' +
            `<div class="node-label">${$.isFunction(nodeTypeConfig.label) ?
                nodeTypeConfig.label.call(null, editor) : nodeTypeConfig.label}</div>` + // 节点label
            `<div class="node-icon-container"><span class="dt-icon" 
            style="background-image:url(${nodeTypeConfig.icon || require('./css/icon/default.png')})"></span></div>` +
            // 节点icon
            (nodeTypeConfig.inputs.enable ? '<div class="node-port node-port-inputs"></div>' : '') + // 节点输入端口
            (nodeTypeConfig.outputs.enable ? '<div class="node-port node-port-outputs"></div>' : '') + // 节点输出端口
            '</div>'
        );
        $tpl.data(Constant.PALETTE_NODE_CONFIG, nodeTypeConfig);
        nodeTypeConfig.color && $tpl.css('background-color', nodeTypeConfig.color);
        return $tpl;
    }

    static renderCatagory(catagory, $palette) {
        // 渲染节点类别列表
        if (!catagory) {
            throw Error('节点类别为空：registerNodeCatagory');
        }
        let arr = [];
        catagory.forEach((cata) => {
            arr.push(
                `<header class="cata-label">${cata.label}</header>` +
                `<section class="cata-section" id="${Constant.PREFIX_OF_CATAGORY + cata.id}"></section>`
            );
        });
        $palette.append(arr.join(''));
    }

    static renderPalette(editor) {
        let $palette = editor.$palette;
        // 先渲染节点类别
        ViewUtil.renderCatagory(editor.getNodeCatagory(), $palette);
        // 再渲染节点类型
        editor.getNodeTypes().forEach((RealNodeType) => {
            let nodeTypeConfig = new RealNodeType();
            let $nodePaletteTpl = ViewUtil.getNodeTpl4Palette(nodeTypeConfig, editor);
            let $nodeWrapper = $palette.find(`#${Constant.PREFIX_OF_CATAGORY + nodeTypeConfig.catagory}`);
            $nodeWrapper.append($nodePaletteTpl);
        });
        // 渲染手风琴
        $palette.accordion({
            header: '.cata-label',
            collapsible: false,
        });
        // 绑定拖拽事件
        ViewUtil.dragAndDrop4Palette(editor);
    }

    static transform(node4svg, x, y) {
        window.requestAnimationFrame(function () {
            node4svg.attr('transform', `translate(${parseInt(x)}, ${parseInt(y)})`);
        });
    }

    static judgeNodeIntersectOnLine(x, y, editor) {
        // 判断dt-pallete中拖出的节点是否与dt-line相交
        // dt-pallete中节点的大小固定为：120 x 30
        const PALLETE_NODE_WIDTH = 120;
        const PALLETE_NODE_HEIGHT = 30;
        const PALLETE_CLIP_WIDTH = 30;
        // 定义clip矩形
        let clip = {
            x: x + ((PALLETE_NODE_WIDTH - PALLETE_CLIP_WIDTH) / 2),
            y,
            w: PALLETE_CLIP_WIDTH,
            h: PALLETE_NODE_HEIGHT,
        };
        let legalLine = [];
        editor.getRelations().forEach((item) => {
            let line = item.line;
            let lineSVG = line.node();
            // 获取连线的总长度
            let len = lineSVG.getTotalLength();
            // 从连线上抽取一定数量的坐标点作为样本
            // 判断有多少样本落在clip矩形内
            let sample = [];
            for (let i = 0; i < len; i += 10) {
                let p = lineSVG.getPointAtLength(i);
                if (ViewUtil.isPointInRect(p, clip)) {
                    sample.push(p);
                }
            }
            if (sample.length) {
                legalLine.push(item);
            }
        });
        return legalLine;
    }

    static isPointInRect(point, rect) {
        // 判断点是否落在矩形内
        return (
            (point.x >= rect.x && point.x <= (rect.x + rect.w)) &&
            (point.y >= rect.y && point.y <= (rect.y + rect.h))
        );
    }

    static clearLineSplice(editor) {
        // 清除line-splice样式
        editor.getSVG().selectAll(`.${Constant.SVG_DT_LINE}.${Constant.SVG_LINE_SPLICE}`)
            .classed(`${Constant.SVG_LINE_SPLICE}`, false);
    }

    static dragAndDrop4Palette(editor) {
        // 绑定拖拽事件 - dt-palette
        let start = function (e, ui) {
            let nodeTypeConfig = $(e.target).data(Constant.PALETTE_NODE_CONFIG);
            ui.helper.data(Constant.PALETTE_NODE_CONFIG, nodeTypeConfig);
        };
        let drag = function (e, ui) {
            // 支持在两个节点中间拖拽添加 line_splice
            window.requestAnimationFrame(function () {
                let nc = ui.helper.data(Constant.PALETTE_NODE_CONFIG);
                if (nc.inputs.enable && nc.outputs.enable) {
                    // 若当前节点同时支持输入和输出，则开启此效果
                    let offset = ui.offset;
                    let $canvas = editor.$canvas;
                    let offset4thiz = $canvas.offset();
                    let y = $canvas.scrollTop() + offset.top - offset4thiz.top + Constant.SVG_PALLETE_FACTOR_Y;
                    let x = $canvas.scrollLeft() + offset.left - offset4thiz.left;
                    ViewUtil.clearLineSplice(editor);
                    ui.helper.data(Constant.TAG_LINE_SPLICE, null);
                    let factor = editor.getScaleFactor();
                    x = x / factor;
                    y = y / factor;
                    let lineArr = ViewUtil.judgeNodeIntersectOnLine(x, y, editor);
                    if (lineArr.length) {
                        // 默认取出第一条连线
                        let item = lineArr[0];
                        let line = item.line;
                        let lineGroup = d3.select(line.node().parentNode);
                        lineGroup.classed(`${Constant.SVG_LINE_SPLICE}`, true);
                        ui.helper.data(Constant.TAG_LINE_SPLICE, item);
                    }
                }
            });
        };
        let drop = function (e, ui) {
            let offset = ui.offset;
            let offset4thiz = $(this).offset();
            let $canvas = editor.$canvas;
            let y = $canvas.scrollTop() + offset.top - offset4thiz.top + Constant.SVG_PALLETE_FACTOR_Y;
            let x = $canvas.scrollLeft() + offset.left - offset4thiz.left;
            let nodeTypeId = ui.helper.data(Constant.PALETTE_NODE_CONFIG)['nodeTypeId'];
            let RealNodeType = editor.getNodeTypes().get(nodeTypeId);
            let nodeId = uuid();
            let nodeTypeConfig = new RealNodeType();
            // 根据缩放比例调整节点坐标（仅限于拖拽节点到画布上时）
            let factor = editor.getScaleFactor();
            x = x / factor;
            y = y / factor;
            nodeTypeConfig.x = x;
            nodeTypeConfig.y = y;
            nodeTypeConfig.nodeId = nodeId;
            let newNode = ViewUtil._drawNodeOnCanvas(nodeTypeConfig, editor);
            ViewUtil.clearLineSplice(editor);
            let lineSpliceItem = ui.helper.data(Constant.TAG_LINE_SPLICE);
            // 判断是否是line-splice
            if (lineSpliceItem) {
                ViewUtil.deleteLine(lineSpliceItem.line, editor);
                ViewUtil.drawLine(lineSpliceItem.from, newNode, editor);
                ViewUtil.drawLine(newNode, lineSpliceItem.to, editor);
            }
            ui.helper.data(Constant.TAG_LINE_SPLICE, null);
        };
        $('.node-tpl', editor.$palette).draggable({
            helper: 'clone',
            revert: 'invalid',
            containment: editor.$el,
            start,
            drag,
        });
        editor.$canvas.droppable({
            accept: '.node-tpl',
            tolerance: 'fit',
            drop,
        });
    }

    static _calcTextWidth(labelTxt) {
        // 计算节点label宽度
        let $span = $('<span>').css({
            position: 'absolute',
            top: '-9999px',
        }).text(labelTxt);
        let width = $span.appendTo('body').width();
        $span.remove();
        return Math.min(parseInt(width), Constant.SVG_MAX_WIDTH_OF_NODE_RECT);
    }

    static _updateNodeSize(node4svg, editor) {
        // 更新节点尺寸
        let labelTxt = node4svg.select('.node-label').text();
        let width = ViewUtil._calcTextWidth(labelTxt);
        let width4rect = Math.max(width + Constant.SVG_WIDTH_OF_NODE_ICON, Constant.SVG_MIN_WIDTH_OF_NODE_RECT);
        // 设置节点宽度
        node4svg.select(`.${Constant.SVG_NODE_RECT}`).attr('width', width4rect);
        // 设置node-status位置
        node4svg.select(Constant.SVG_SELECTOR_NODE_STATUS_CHANGED).attr('x', width4rect - 10);
        node4svg.select(Constant.SVG_SELECTOR_NODE_STATUS_ERROR).attr('x', width4rect - 25);
        // 设置port.inputs位置
        ViewUtil.transform(node4svg.select('.port.inputs'), -5, 10);
        // 设置port.outputs位置
        ViewUtil.transform(node4svg.select('.port.outputs'), width4rect - 5, 10);
    }

    static _generateLinePath(from, to) {
        // 生成连线路径
        let NODE_WIDTH = Constant.SVG_LINE_FACTOR_NODE_WIDTH;
        let NODE_HEIGHT = Constant.SVG_LINE_FACTOR_NODE_HEIGHT;
        let pathArr = [
            `M ${from.x + from.w} ${from.y + from.h / 2} `,
            `C ${from.x + from.w + NODE_WIDTH} ${from.y + from.h / 2 + NODE_HEIGHT} `,
            `${to.x - NODE_WIDTH} ${to.y - NODE_HEIGHT} `,
            `${to.x} ${to.y} `,
        ];
        return pathArr.join('');
    }

    static _dragNodeOnCanvas(editor) {
        // 在画布中定义节点的拖拽行为
        let inst4drag = editor.___inst4drag;
        // let inst4drag;
        return function () {
            if (!inst4drag) {
                let start = function (d) {
                    let node = d3.select(this);
                    let isSelected = node.classed('selected');
                    if (!isSelected) {
                        ViewUtil.clearSelectedOnCanvas(editor);
                        node.classed('selected', true);
                    }
                    let selectedNodes = editor.getSVG().selectAll(`.${Constant.SVG_DT_NODE}.selected`).nodes();
                    d.isMutiMode = selectedNodes.length > 1;
                    d.selectedNodes = selectedNodes;
                };
                let drag = function (d) {
                    let x = d3.event.x;
                    let y = d3.event.y;
                    let ox = d.x;
                    let oy = d.y;

                    if (d.isMutiMode) {
                        // 多个节点拖动
                        let dx = parseInt(d3.event.dx);
                        let dy = parseInt(d3.event.dy);
                        let illegalNodes = [];
                        for (let i = 0, len = d.selectedNodes.length; i < len; i++) {
                            let item = d.selectedNodes[i];
                            let n = d3.select(item);
                            let datum = n.datum();
                            datum.x = datum.x + dx;
                            datum.y = datum.y + dy;
                            if (ViewUtil.isOverstepBoundary(editor, n)) {
                                illegalNodes.push(n);
                            }
                            datum.x = datum.x - dx;
                            datum.y = datum.y - dy;
                        }
                        if (!illegalNodes.length) {
                            d.selectedNodes.forEach((item) => {
                                let n = d3.select(item);
                                let datum = n.datum();
                                datum.x = datum.x + dx;
                                datum.y = datum.y + dy;
                                ViewUtil.transform(n, datum.x, datum.y);
                            });
                        }
                    } else {
                        // 单个节点拖动
                        d.x = x;
                        d.y = y;
                        let node = d3.select(this);
                        // 判断节点是否越过边界
                        if (ViewUtil.isOverstepBoundary(editor, node)) {
                            d.x = ox;
                            d.y = oy;
                        }
                        // 拖动节点
                        ViewUtil.transform(node, d.x, d.y);
                    }
                    // 更新连线位置
                    ViewUtil.updateAllLinePath(editor);
                };
                let end = function (d) {
                    d.selectedNodes = null;
                };
                inst4drag = editor.___inst4drag = d3.drag()
                    .on('start', start)
                    .on('drag', drag)
                    .on('end', end);
            }
            return inst4drag;
        };
    }

    static _getNodeSize(node) {
        // 获取节点坐标和宽高
        let datum = node.datum();
        let rect = {
            x: datum.x,
            y: datum.y,
            w: datum.w,
            h: datum.h,
        };
        return rect;
    }

    static _getNodeSizeRealTime(node) {
        // 实时获取节点坐标和宽高
        let datum = node.datum();
        let rectNode = node.select(`.${Constant.SVG_NODE_RECT}`);
        let rect = {
            x: datum.x,
            y: datum.y,
            w: parseInt(rectNode.attr('width')),
            h: parseInt(rectNode.attr('height')),
        };
        // 缓存宽高
        datum.w = rect.w;
        datum.h = rect.h;
        return rect;
    }

    static isOverstepBoundary(editor, node) {
        // 判断节点是否越过画布边界
        let canvas = {
            x: 0,
            y: 0,
            w: editor.config.settings.size,
            h: editor.config.settings.size,
        };
        let rect = ViewUtil._getNodeSize(node);
        let flag = false;
        if (rect.x < canvas.x ||
            rect.y < canvas.y ||
            rect.x + rect.w > canvas.w ||
            rect.y + rect.h > canvas.h) {
            flag = true;
        }
        return flag;
    }

    static updateAllLinePath(editor) {
        // 更新全部连线位置信息
        editor.getRelations().forEach((val, key) => {
            let line = val.line;
            let from = val.from;
            let to = val.to;
            line.attr('d', ViewUtil._generateLinePath(
                ViewUtil._genPos4FromNode(from),
                ViewUtil._genPos4ToNode(to)
            ));
        });
    }

    static _genPos4FromNode(fromNode) {
        // 获取起始节点的位置信息和几何信息
        let data = fromNode.datum();
        let rect = fromNode.select(`.${Constant.SVG_NODE_RECT}`);
        return {
            x: data.x,
            y: data.y,
            w: parseInt(rect.attr('width')),
            h: parseInt(rect.attr('height')),
        };
    }

    static _genPos4ToNode(toNode) {
        // 获取终端节点的位置信息和几何信息
        let data = toNode.datum();
        let rect = toNode.select(`.${Constant.SVG_NODE_RECT}`);
        let w = parseInt(rect.attr('width'));
        let h = parseInt(rect.attr('height'));
        return {
            x: data.x,
            y: data.y + h / 2,
            ox: data.x,
            oy: data.y,
            w,
            h,
        };
    }

    static _bindEventOnNodePort(editor, node4svg) {
        let mouseleave = function () {
            d3.select(this).classed('hovered', false);
        };
        let mouseenter = function () {
            d3.select(this).classed('hovered', true);
        };
        let mousedown = function () {
            let rect = node4svg.select('.node-rect');
            let svg = editor.getSVG();
            let { fakeLine, g, } = ViewUtil.drawFakeLine(node4svg, editor);
            svg.on('mouseup.port', mouseup4line(g, fakeLine, svg, node4svg));
            let mousemove = function () {
                // 更新fakeLine
                let mousePos = d3.mouse(this);
                let factor = editor.getScaleFactor();
                mousePos[0] = mousePos[0] / factor;
                mousePos[1] = mousePos[1] / factor;
                let pathData = ViewUtil._generateLinePath(
                    ViewUtil._genPos4FromNode(node4svg),
                    { x: mousePos[0], y: mousePos[1], });
                fakeLine.attr('d', pathData);
                d3.event.stopPropagation();
                d3.event.preventDefault();
            };
            svg.on('mousemove.port', mousemove);
            d3.event.stopPropagation();
        };
        let mouseup4line = function (gLine, line, svg, fromNode) {
            return function () {
                let target = d3.select(d3.event.target);
                let toNode = null;
                // 判断终端节点是否合法
                if (target.classed(Constant.SVG_NODE_PORT) || target.classed(Constant.SVG_NODE_STATUS)) {
                    toNode = d3.select(target.node().parentNode.parentNode);
                } else if (target.classed(Constant.SVG_NODE_RECT)) {
                    toNode = d3.select(target.node().parentNode);
                }
                gLine.remove();
                let fromId = node4svg.attr('id');
                if (!toNode ||
                    toNode.attr('id') === fromId ||
                    !toNode.datum().inputs.enable ||
                    ViewUtil.hasRelation(editor, fromNode, toNode)) {
                    // 移除监听器
                    svg.on('.port', null);
                    d3.event.stopPropagation();
                    return;
                }
                // 节点合法
                ViewUtil.drawLine(fromNode, toNode, editor);
                // 移除监听器
                svg.on('.port', null);
                d3.event.stopPropagation();
            };
        };

        // 只为output绑定绘制连线事件
        node4svg.selectAll('.node-port.node-port-output')
            .on('mousedown', mousedown);
        // 为node-port绑定鼠标交互事件
        node4svg.selectAll('.node-port')
            .on('mouseenter', mouseenter)
            .on('mouseleave', mouseleave);
    }

    static drawFakeLine(from, editor) {
        // 绘制连线（用于鼠标绘制连线）
        let svg = editor.getSVG();
        let lineGroups = svg.select(`.${Constant.SVG_DT_LINE_GROUP}`);
        let g = lineGroups.append('svg:g')
            .classed('dt-line', true);
        let fromPos = ViewUtil._genPos4FromNode(from);
        let fakeLine = g.append('svg:path')
            .classed('path-line', true)
            .classed('hovered dotted', true)
            .attr('d', ViewUtil._generateLinePath(
                fromPos,
                { x: fromPos.x + fromPos.w, y: fromPos.y + fromPos.h / 2, }
            ));
        return { fakeLine, g, };
    }

    static drawLine(from, to, editor) {
        // 绘制两个节点之间的连线
        let svg = editor.getSVG();
        let lineGroups = svg.select(`.${Constant.SVG_DT_LINE_GROUP}`);
        let g = lineGroups.append('svg:g')
            .attr('id', ViewUtil.uuid())
            .classed('dt-line', true);
        let line = g.append('svg:path')
            .attr('tabindex', -1)
            .classed('path-line', true)
            .attr('d', ViewUtil._generateLinePath(
                ViewUtil._genPos4FromNode(from),
                ViewUtil._genPos4ToNode(to)
            ));
        editor._setRelation(from, to, line, g.attr('id'));
        // dt-line绑定mouseenter事件
        let mouseleave = function () {
            d3.select(this).classed('hovered', false);
        };
        let mouseenter = function () {
            d3.select(this).classed('hovered', true);
        };
        let click = function () {
            d3.selectAll('.selected').classed('selected', false);
            d3.select(this).classed('selected', true);
        };
        let keyup = function () {
            // 删除连线
            if (d3.event.keyCode === Constant.KEY_CODE_DELETE) {
                let line = d3.select(this);
                ViewUtil.deleteLine(line, editor);
            }
        };
        line.on('mouseenter', mouseenter)
            .on('mouseleave', mouseleave)
            .on('click', click)
            .on('keyup', keyup);
    }

    static deleteLine(line, editor) {
        // 删除连线
        let g = d3.select(line.node().parentNode);
        let id = g.attr('id');
        let bean = editor._getRelation(id);
        let { from, to, } = bean;
        editor.emit(Constant.EVENT_DELETED_LINE, { id, from, to, });
        // 从画布移除
        editor._removeRelation(id);
        g.remove();
    }

    static _bindEventOnNode(editor, node4svg) {
        // 给节点.port > .node-port绑定mouseenter事件
        ViewUtil._bindEventOnNodePort(editor, node4svg);
        let mouseleave = function () {
            d3.select(this).classed('hovered', false);
        };
        let mouseenter = function () {
            d3.select(this).classed('hovered', true);
        };
        let clicked = function () {
            // d3.selectAll(`.selected`).classed('selected', false);
            // d3.select(this).classed('selected', true);
        };
        // 为节点绑定单击事件
        node4svg.on('mouseleave', mouseleave);
        node4svg.on('mouseenter', mouseenter);
        // node4svg.on('click', clicked);
        node4svg.on('keyup', function () {
            switch (d3.event.keyCode) {
                case Constant.KEY_CODE_DELETE: {
                    editor.getSVG().selectAll(`.${Constant.SVG_DT_NODE}.selected`)
                        .nodes()
                        .forEach((item) => {
                            ViewUtil.deleteNode(d3.select(item), editor);
                        });
                    break;
                }
            }
        });
        // TODO - 为节点绑定双击事件
    }

    static deleteNode(node, editor) {
        // 删除节点
        let datum = node.datum();
        let id = node.attr('id');
        // 删除连线
        editor.getRelations().forEach((item) => {
            if (item.from.attr('id') === id || item.to.attr('id') === id) {
                ViewUtil.deleteLine(item.line, editor);
            }
        });
        node.remove();
        editor.emit(Constant.EVENT_DELETED_NODE, { datum, });
    }

    static hasRelation(editor, from, to, reverse = false) {
        // 判断两个节点直接是否已存在连线
        let fromId = from.attr('id');
        let toId = to.attr('id');
        let relation = null;
        editor.getRelations()
            .forEach(function (val, key) {
                let fromNode = val.from;
                let fromNodeId = fromNode.attr('id');
                let toNode = val.to;
                let toNodeId = toNode.attr('id');
                if (fromId === fromNodeId && toId === toNodeId) {
                    relation = val;
                } else if (reverse && fromId === toNodeId && toId === fromNodeId) {
                    relation = val;
                }
            });
        return relation;
    }

    static cloneNode(sourceNode, editor) {
        // 克隆节点（深克隆）
        // TODO - 考虑config.prop属性被双向绑定的情况
        let settings = editor.config.settings;
        let srcDatum = sourceNode.datum();
        let clonedDatum = $.extend(true, {}, srcDatum);
        clonedDatum.nodeId = ViewUtil.uuid();
        // TODO - 节点坐标适当偏移
        clonedDatum.x += 5;
        clonedDatum.y += 10;
        return ViewUtil._drawNodeOnCanvas(clonedDatum, editor);
    }

    static _drawNodeOnCanvas(config, editor) {
        // 添加节点到画布
        let node4svg = ViewUtil.getNodeTpl4SVG(config, editor);
        // 缓存节点数据
        node4svg.datum(config);
        // 为节点获取最佳宽度
        ViewUtil._updateNodeSize(node4svg, editor);
        // 根据节点最新宽度调整节点坐标
        ViewUtil._fixNodePos(editor, node4svg);
        ViewUtil.transform(node4svg, config.x, config.y);
        // 给节点绑定拖拽事件
        node4svg.call(ViewUtil._dragNodeOnCanvas(editor)());
        // 给node节点绑定事件
        ViewUtil._bindEventOnNode(editor, node4svg);
        return node4svg;
    }

    static _fixNodePos(editor, node) {
        // 根据节点最新缩放比例和宽度调整节点坐标
        if (ViewUtil.isOverstepBoundary(editor, node)) {
            let datum = node.datum();
            let rect = ViewUtil._getNodeSizeRealTime(node);
            let canvas = {
                w: editor.config.settings.size,
                h: editor.config.settings.size,
            };
            let offset = 0;
            // 只处理宽度越界
            if ((offset = rect.x + rect.w - canvas.w) > 0) {
                datum.x = rect.x - offset - 10;
            }
        }
    }

    static _drawSVGCanvas(settings) {
        // 绘制svg节点
        let svg = d3.select(`#${Constant.CANVAS_ID}`)
            .append('svg:svg')
            .attr('height', settings.size)
            .attr('width', settings.size)
            .attr('pointer-events', 'all')
            .style('cursor', 'crosshair')
            .on('contextmenu', function () {
                // 屏蔽默认右键菜单事件
                d3.event.preventDefault();
            });
        return svg;
    }

    static _drawRectAsBackground(g, settings, editor) {
        // 绘制rect节点作为背景画布
        let keyup = function () {
            if (d3.event.keyCode === Constant.KEY_CODE_DELETE) {
                d3.selectAll(`.${Constant.SVG_DT_NODE}.selected`)
                    .nodes()
                    .forEach((item) => {
                        ViewUtil.deleteNode(d3.select(item), editor);
                    });
            }
        };
        let mousedown = function () {
            if (d3.event.button === Constant.KEY_CODE_MOUSE_LEFT) {
                // draw lasso
                let mousePos = d3.mouse(this);
                let ox = mousePos[0];
                let oy = mousePos[1];
                let x = ox;
                let y = oy;
                let svg = editor.getSVG();
                let canvas = svg.select(`.${Constant.SVG_INNER_CANVAS}`);
                svg.selectAll('.lasso').remove();
                let lasso = canvas.append('svg:rect')
                    .classed('lasso', true)
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', 1)
                    .attr('height', 1);
                svg.selectAll('.dt-node-group, .dt-line-group').style('pointer-events', 'none');

                bg.on('mousemove.lasso', function () {
                    let mousePos = d3.mouse(this);
                    let mx = mousePos[0];
                    let my = mousePos[1];

                    let x = parseInt(lasso.attr('x'));
                    let y = parseInt(lasso.attr('y'));

                    let w = mx - ox;
                    let h = my - oy;

                    let isDirtyX = false;
                    let isDirtyY = false;

                    if (w < 0) {
                        x = mx;
                        isDirtyX = true;
                    }
                    if (h < 0) {
                        y = my;
                        isDirtyY = true;
                    }

                    if (isDirtyX) {
                        lasso.attr('x', x);
                    }
                    if (isDirtyY) {
                        lasso.attr('y', y);
                    }

                    lasso.attr('width', Math.abs(w))
                        .attr('height', Math.abs(h));
                });
                bg.on('mouseup.lasso', function () {
                    // 判断是否有节点被覆盖
                    ViewUtil.clearSelectedOnCanvas(editor);
                    let boudary = {
                        x: parseInt(lasso.attr('x')),
                        y: parseInt(lasso.attr('y')),
                        w: parseInt(lasso.attr('width')),
                        h: parseInt(lasso.attr('height')),
                    };
                    svg.selectAll(`.${Constant.SVG_DT_NODE}`)
                        .nodes()
                        .forEach((item) => {
                            let node = d3.select(item);
                            let b = ViewUtil._getNodeSizeRealTime(node);
                            if (ViewUtil.collide(boudary, b)) {
                                node.classed('selected', true);
                            }
                        });
                    lasso.remove();
                    svg.selectAll('.dt-node-group, .dt-line-group').style('pointer-events', 'auto');
                    bg.on('.lasso', null);
                });
            }
        };
        let bg = g.append('svg:rect')
            .attr('tabindex', -1)
            .attr('class', 'dt-c-bg')
            .attr('width', settings.size)
            .attr('height', settings.size)
            .attr('fill', Constant.SVG_BG_COLOR);
        bg.on('mousedown', mousedown);
        bg.on('keyup', keyup);
        bg.on('keydown', function() {
            // TODO - 绑定 ctrl + C(V) 事件
            if (d3.event.ctrlKey) {
                let svg = editor.getSVG();
                switch (d3.event.keyCode) {
                    case Constant.KEY_CODE_ALPHA_C: {
                        // ctrl + c
                        let copyedNodes = svg.selectAll(`.${Constant.SVG_DT_NODE}.selected`).nodes();
                        editor._setCopyedNodes(copyedNodes);
                        console.log('复制了 ', copyedNodes.length, ' 个节点');
                        break;
                    }
                    case Constant.KEY_CODE_ALPHA_V: {
                        // ctrl + v
                        let copyedNodes = Array.from(editor.getCopyedNodes());
                        console.log('粘贴了 ', copyedNodes.length, ' 个节点');
                        ViewUtil.clearSelectedOnCanvas(editor);
                        let map = new Map();
                        // 复制节点
                        copyedNodes.forEach((item) => {
                            let srcNode = d3.select(item);
                            let clonedNode = ViewUtil.cloneNode(srcNode, editor);
                            clonedNode.classed('selected', true);
                            map.set(srcNode.datum().nodeId, clonedNode);
                        });
                        // 复制连线关系
                        let set = new Set();
                        // 过滤出要复制的连线
                        editor.getRelations().forEach((lineItem) => {
                            if (copyedNodes.indexOf(lineItem.from) && copyedNodes.indexOf(lineItem.to)) {
                                set.add(lineItem);
                            }
                        });
                        // 确定from和to节点
                        set.forEach((lineItem) => {
                            let fromId = lineItem.from.datum().nodeId;
                            let toId = lineItem.to.datum().nodeId;
                            let clonedFromNode = map.get(fromId);
                            let clonedToNode = map.get(toId);
                            if (clonedFromNode && clonedToNode) {
                                ViewUtil.drawLine(clonedFromNode, clonedToNode, editor);
                            }
                        });
                        break;
                    }
                }
            }
        });
    }

    static clearSelectedOnCanvas(editor) {
        editor.getSVG().selectAll('.selected').classed('selected', false);
    }

    static collide(rect1, rect2) {
        // 判断矩形是否碰撞
        var maxX, maxY, minX, minY;

        maxX = rect1.x + rect1.w >= rect2.x + rect2.w ? rect1.x + rect1.w : rect2.x + rect2.w;
        maxY = rect1.y + rect1.h >= rect2.y + rect2.h ? rect1.y + rect1.h : rect2.y + rect2.h;
        minX = rect1.x <= rect2.x ? rect1.x : rect2.x;
        minY = rect1.y <= rect2.y ? rect1.y : rect2.y;

        if (maxX - minX <= rect1.w + rect2.w && maxY - minY <= rect1.h + rect2.h) {
            return true;
        }
            return false;

    }

    static _drawGrid(grid, settings) {
        // 绘制网格
        let temp = [];
        for (var i = 0; i < settings.size; i += settings.grid.gap) {
            temp.push(i);
        }
        // horizonal
        grid.selectAll('line.horizonal').remove();
        grid.selectAll('line.horizonal')
            .data(temp)
            .enter()
            .append('svg:line')
            .attr('class', 'horizonal')
            .attr('x1', 0)
            .attr('x2', settings.size)
            .attr('y1', function (d) {
                return d;
            })
            .attr('y2', function (d) {
                return d;
            })
            .attr('fill', 'none')
            .attr('stroke', settings.grid.strokeColor)
            .attr('stroke-width', '1px')
            .attr('shape-rendering', 'crispEdges');
        // vertical
        grid.selectAll('line.vertical').remove();
        grid.selectAll('line.vertical')
            .data(temp)
            .enter()
            .append('svg:line')
            .attr('class', 'vertical')
            .attr('y1', 0)
            .attr('y2', settings.size)
            .attr('x1', function (d) {
                return d;
            })
            .attr('x2', function (d) {
                return d;
            })
            .attr('fill', 'none')
            .attr('stroke', settings.grid.strokeColor)
            .attr('stroke-width', '1px')
            .attr('shape-rendering', 'crispEdges');
        grid.style('visibility', settings.grid.enable ? 'visible' : 'hidden');
    }

    static renderWorkspace(editor) {
        // 渲染dt-canvas
        let config = editor.config;
        let settings = config.settings;
        /* <svg>
         <g class="inner-canvas">
         <rect class="dt-c-bg"></rect>
         <g class="dt-c-grid">
         <line class="horizonal"></line>
         <line class="vertical"></line>
         </g>
         <g class="dt-link-group"></g>
         <g class="dt-node-group">
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
         </g>
         </svg> */
        // 绘制svg
        let svg = ViewUtil._drawSVGCanvas(settings);
        editor._setSVG(svg);
        let g4canvas = svg.append('svg:g').attr('class', Constant.SVG_INNER_CANVAS);
        // 绘制rect背景
        ViewUtil._drawRectAsBackground(g4canvas, settings, editor);
        // 绘制网格grid
        let grid = g4canvas.append('svg:g').attr('class', Constant.SVG_GRID);
        ViewUtil._drawGrid(grid, settings);
        g4canvas.append('svg:g').classed(Constant.SVG_DT_LINE_GROUP, true);
        g4canvas.append('svg:g').classed(Constant.SVG_DT_NODE_GROUP, true);
        // TODO - 渲染dt-footer
        ViewUtil.renderFooter(editor);
    }
    static renderFooter(editor){
        let $footer = editor.$workspace.find(`.dt-footer`);
        let tpl = [
            `<span class="dt-btn zoom-in">缩小</span>`,
            `<span class="dt-btn zoom-zero">还原</span>`,
            `<span class="dt-btn zoom-out">放大</span>`,
            `<span class="dt-btn settings">设置</span>`,
        ].join('');
        $footer.append(tpl)
            .on('click.zoomIn', '.dt-btn.zoom-in', function () {
                // TODO - scale in
                let originalFactor = editor.getScaleFactor();
                ViewUtil.zoom(editor, parseFloat((originalFactor - Constant.SVG_SCALE_STEP).toFixed(1)));
                return false;
            })
            .on('click.scaleZero', '.dt-btn.zoom-zero', function () {
                // TODO - scale zero
                ViewUtil.zoom(editor, 1);
                return false;
            })
            .on('click.scaleIn', '.dt-btn.zoom-out', function () {
                // TODO - scale out
                let originalFactor = editor.getScaleFactor();
                ViewUtil.zoom(editor, parseFloat((originalFactor + Constant.SVG_SCALE_STEP).toFixed(1)));
                return false;
            });
    }
    static zoom(editor, factor){
        window.requestAnimationFrame(function () {
            editor.setScaleFactor(factor);
            factor = editor.getScaleFactor();
            let svg = editor.getSVG();
            let size = editor.config.settings.size * factor;
            svg.attr('width', size).attr('height', size);
            svg.select(`.${Constant.SVG_INNER_CANVAS}`).attr('transform', `scale(${factor})`);

        });
    }
}

export default ViewUtil;
