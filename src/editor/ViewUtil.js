'use strict';
import * as d3 from 'd3'
import $ from 'jquery'
import uuid from 'uuid/v4'
import 'jquery-ui/ui/widgets/accordion.js'
import 'jquery-ui/ui/widgets/draggable.js'
import 'jquery-ui/ui/widgets/droppable.js'
import 'jquery-ui/themes/base/accordion.css'
import 'jquery-ui/themes/base/draggable.css'
import Constant from './Constant.js'

class ViewUtil {
    static uuid(){
        return uuid();
    }
    static getNodeTpl4SVG(nodeTypeConfig, editor){
        // .dt-canvas
        /*<g class="dt-node" id="">
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
        </g>*/
        let g = editor.getSVG().select(`.${Constant.SVG_DT_NODE_GROUP}`);
        let g4node = g.append('svg:g').attr('class', Constant.SVG_DT_NODE).attr('id', nodeTypeConfig.nodeId);
        // rect.node-rect
        g4node.append('svg:rect')
            .attr('class', 'node-rect')
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
    static getNodeTpl4Palette(nodeTypeConfig, editor){
        // 获取节点html模板 - .dt-palette
        let $tpl = $(
            '<div class="node-tpl">' +
            `<div class="node-label">${$.isFunction(nodeTypeConfig.label) ? nodeTypeConfig.label.call(null, editor) : nodeTypeConfig.label}</div>` + // 节点label
            `<div class="node-icon-container"><span class="dt-icon" style="background-image:url(${nodeTypeConfig.icon||require('./css/icon/default.png')})"></span></div>` + // 节点icon
            (nodeTypeConfig.inputs.enable ? '<div class="node-port node-port-inputs"></div>' : '') + // 节点输入端口
            (nodeTypeConfig.outputs.enable ? '<div class="node-port node-port-outputs"></div>' : '') + // 节点输出端口
            '</div>'
        );
        $tpl.data(Constant.PALETTE_NODE_CONFIG, nodeTypeConfig);
        nodeTypeConfig.color && $tpl.css('background-color', nodeTypeConfig.color);
        console.log($tpl.html(), nodeTypeConfig);
        return $tpl;
    }
    static renderCatagory(catagory, $palette){
        // 渲染节点类别列表
        if(!catagory){
            throw Error('节点类别为空：registerNodeCatagory');
        }
        let arr = [];
        catagory.forEach(cata=>{
            arr.push(
                `<header class="cata-label">${cata.label}</header>` +
                `<section class="cata-section" id="${Constant.PREFIX_OF_CATAGORY+cata.id}"></section>`
            );
        });
        $palette.append(arr.join(''));
    }
    static renderPalette(editor){
        let $palette = editor.$palette;
        // 先渲染节点类别
        ViewUtil.renderCatagory(editor.getNodeCatagory(), $palette);
        // 再渲染节点类型
        editor.getNodeTypes().forEach((RealNodeType)=>{
            let nodeTypeConfig = new RealNodeType();
            let $nodePaletteTpl = ViewUtil.getNodeTpl4Palette(nodeTypeConfig, editor);
            let $nodeWrapper = $palette.find(`#${Constant.PREFIX_OF_CATAGORY + nodeTypeConfig.catagory}`);
            $nodeWrapper.append($nodePaletteTpl);
        });
        // 渲染手风琴
        $palette.accordion({
            header:'.cata-label',
            collapsible: false,
        });
        // 绑定拖拽事件
        ViewUtil.dragAndDrop4Palette(editor);
    }
    static transform(node4svg, x, y){
        node4svg.attr('transform', `translate(${parseInt(x)}, ${parseInt(y)})`);
    }
    static dragAndDrop4Palette(editor){
        // 绑定拖拽事件 - dt-palette
        let start = function (e, ui) {
            let nodeTypeConfig = $(e.target).data(Constant.PALETTE_NODE_CONFIG);
            ui.helper.data(Constant.PALETTE_NODE_CONFIG, nodeTypeConfig.nodeTypeId);
        };
        let drop = function(e, ui){
            let factor = 11; // y轴总是有11px的误差 (待观察)- TODO
            let offset = ui.offset;
            let offset4thiz = $(this).offset();
            let $canvas = editor.$canvas;
            let y = $canvas.scrollTop() + offset.top - offset4thiz.top + factor;
            let x = $canvas.scrollLeft() + offset.left - offset4thiz.left;
            let nodeTypeId = ui.helper.data(Constant.PALETTE_NODE_CONFIG);
            let RealNodeType = editor.getNodeTypes().get(nodeTypeId);
            let nodeId = uuid();
            let nodeTypeConfig = new RealNodeType();
            nodeTypeConfig.x = x;
            nodeTypeConfig.y = y;
            nodeTypeConfig.nodeId = nodeId;
            ViewUtil._drawNodeOnCanvas(nodeTypeConfig, editor);
            editor.log('drop...', nodeTypeConfig);
        };
        $('.node-tpl', editor.$palette).draggable({
            helper: 'clone',
            revert: 'invalid',
            containment: editor.$el,
            start,
        });
        editor.$canvas.droppable({
            accept: '.node-tpl',
            tolerance: 'fit',
            drop,
        });
    }
    static _calcTextWidth(labelTxt){
        // 计算节点label宽度
        let $span = $('<span>').css({
            position: 'absolute',
            top: '-9999px'
        }).text(labelTxt);
        let width = $span.appendTo('body').width();
        $span.remove();
        return parseInt(width);
    }
    static _updateNodeSize(node4svg, editor){
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
        ViewUtil.transform(node4svg.select('.port.outputs'), width4rect-5, 10);
        editor.log('updateNodeSize', width, width4rect);
    }
    static _generateLinePath(from, to){
        // 生成连线路径
        let NODE_WIDTH = Constant.SVG_LINE_FACTOR_NODE_WIDTH;
        let NODE_HEIGHT = Constant.SVG_LINE_FACTOR_NODE_HEIGHT;
        let pathArr = [
            `M ${from.x + from.w} ${from.y + from.h/2} `,
            `C ${from.x + from.w + NODE_WIDTH} ${from.y + from.h/2 + NODE_HEIGHT} `,
            `${to.x - NODE_WIDTH} ${to.y - NODE_HEIGHT} `,
            `${to.x} ${to.y} `,
        ];
        return pathArr.join('');
    }
    static _dragNodeOnCanvas(editor){
        // 在画布中定义节点的拖拽行为
        let inst4drag = editor.___inst4drag;
        // let inst4drag;
        return function () {
            if(!inst4drag){
                let start = function (d){
                    d3.event.x = d.x;
                    d3.event.y = d.y;
                };
                let drag = function (d){
                    let x = d3.event.x;
                    let y = d3.event.y;
                    d.x = x;
                    d.y = y;
                    let node = d3.select(this);
                    // TODO - 判断节点是否越过边界
                    ViewUtil.isOverstepBoundary(editor, node);
                    // 拖动节点
                    ViewUtil.transform(node, d3.event.x, d3.event.y);
                    // 更新连线位置
                    ViewUtil.updateAllLinePath(editor);
                };
                let end = function (d){
                    let x = d3.event.x;
                    let y = d3.event.y;
                    d.x = x;
                    d.y = y;
                };
                inst4drag = editor.___inst4drag = d3.drag()
                    .on('start', start)
                    .on('drag', drag)
                    .on('end', end);
            }
            return inst4drag;
        };
    }
    static isOverstepBoundary(editor, node){
        // TODO - 判断节点是否越过边界


    }
    static updateAllLinePath(editor){
        // 更新全部连线位置信息
        editor.getRelations().forEach((val, key)=>{
            let line = val.line;
            let from = val.from;
            let to = val.to;
            line.attr('d', ViewUtil._generateLinePath(
                ViewUtil._genPos4FromNode(from),
                ViewUtil._genPos4ToNode(to),
            ));
        });
    }
    static _genPos4FromNode(fromNode){
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
    static _genPos4ToNode(toNode){
        // 获取终端节点的位置信息和几何信息
        let data = toNode.datum();
        let rect = toNode.select(`.${Constant.SVG_NODE_RECT}`);
        let w = parseInt(rect.attr('width'));
        let h = parseInt(rect.attr('height'));
        return {
            x: data.x,
            y: data.y + h/2,
            ox: data.x,
            oy: data.y,
            w,
            h
        };
    }
    static _bindEventOnNodePort(editor, node4svg){
        let mouseleave = function () {
            d3.select(this).classed('hovered', false);
        };
        let mouseenter = function () {
            d3.select(this).classed('hovered', true);
        };
        let mousedown = function () {
            let rect = node4svg.select('.node-rect');
            let svg = editor.getSVG();
            let group4line = svg.select(`.${Constant.SVG_DT_LINE_GROUP}`);
            let fromNodePos = ViewUtil._genPos4FromNode(node4svg);
            let pathData = ViewUtil._generateLinePath(
                fromNodePos,
                {x:fromNodePos.x+fromNodePos.w, y:fromNodePos.y+fromNodePos.h/2},
            );
            let gLine = group4line.append('svg:g')
                .attr('id', ViewUtil.uuid())
                .classed('dt-line', true);
            let line = gLine.append('svg:path')
                .classed('path-line', true)
                .attr('d', pathData);
            svg.on('mouseup.port', mouseup4line(gLine, line, svg, node4svg));
            svg.on('mousemove.port', function(){
                // TODO - 给节点outputs端口添加mousedown事件（用于绘制连线）
                let mousePos = d3.mouse(this);
                let pathData = ViewUtil._generateLinePath(
                    ViewUtil._genPos4FromNode(node4svg),
                    {x:mousePos[0], y:mousePos[1]});
                line.attr('d', pathData);
                d3.event.stopPropagation();
                d3.event.preventDefault();
            });
            d3.event.stopPropagation();
        };
        let mouseup4line = function (gLine, line, svg, fromNode) {
            return function(){
                let target = d3.select(d3.event.target);
                let toNode = null;
                // 判断终端节点是否合法
                if(target.classed(Constant.SVG_NODE_PORT) || target.classed(Constant.SVG_NODE_STATUS)){
                    toNode = d3.select(target.node().parentNode.parentNode);
                }else if(target.classed(Constant.SVG_NODE_RECT)){
                    toNode = d3.select(target.node().parentNode);
                }
                let fromId = node4svg.attr('id');
                let toId = toNode.attr('id');
                if(!toNode
                    || toId === fromId
                    || !toNode.datum().inputs.enable
                    || ViewUtil.hasRelation(editor, fromNode, toNode)){
                    // 若终端节点不合法则移除
                    gLine.remove();
                    // 移除监听器
                    svg.on('.port', null);
                    d3.event.stopPropagation();
                    return;
                }
                // 节点合法
                // 调整line终点位置
                let pathData = ViewUtil._generateLinePath(
                    ViewUtil._genPos4FromNode(fromNode),
                    ViewUtil._genPos4ToNode(toNode)
                );
                line.attr('d', pathData);
                // 存储line
                editor._setRelation(fromNode, toNode, line, gLine.attr('id'));
                // 移除监听器
                svg.on('.port', null);
                d3.event.stopPropagation();
            };
        };

        node4svg.selectAll('.node-port')
            .on('mousedown', mousedown)
            .on('mouseenter', mouseenter)
            .on('mouseleave', mouseleave);
    }
    static hasRelation(editor, from, to, reverse=false){
        // 判断两个节点直接是否已存在连线
        let fromId = from.attr('id');
        let toId = to.attr('id');
        let relation = null;
        editor.getRelations()
            .forEach(function(val, key){
                let fromNode = val.from;
                let fromNodeId = fromNode.attr('id');
                let toNode = val.to;
                let toNodeId = toNode.attr('id');
                if(fromId === fromNodeId && toId === toNodeId){
                    relation = val;
                }else if(reverse && fromId === toNodeId && toId === fromNodeId){
                    relation = val;
                }
            });
        return relation;
    }
    static _drawNodeOnCanvas(config, editor){
        // 添加节点到画布
        let node4svg = ViewUtil.getNodeTpl4SVG(config, editor);
        node4svg.datum(config);
        ViewUtil.transform(node4svg, config.x, config.y);
        ViewUtil._updateNodeSize(node4svg, editor);
        // 给节点绑定拖拽事件
        node4svg.call(ViewUtil._dragNodeOnCanvas(editor)());
        // 给节点.port > .node-port绑定mouseenter事件
        ViewUtil._bindEventOnNodePort(editor, node4svg);
        return node4svg;
    }
    static _drawSVGCanvas(settings){
        // 绘制svg节点
        return d3.select(`#${Constant.CANVAS_ID}`)
            .append('svg:svg')
            .attr('height', settings.size)
            .attr('width', settings.size)
            .attr("pointer-events", "all")
            .style("cursor","crosshair")
            .on("contextmenu", function(){
                // 屏蔽默认右键菜单事件
                d3.event.preventDefault();
            });
    }
    static _drawRectAsBackground(g, settings){
        // 绘制rect节点作为背景画布
        g.append('svg:rect')
            .attr('class', 'dt-c-bg')
            .attr('width', settings.size)
            .attr('height', settings.size)
            .attr('fill', Constant.SVG_BG_COLOR);
    }
    static _drawGrid(grid, settings){
        // 绘制网格
        let temp = [];
        for(var i=0; i<settings.size; i+=settings.grid.gap){
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
            .attr('y1', function(d){ return d;})
            .attr('y2', function(d){ return d;})
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
            .attr('x1', function(d){ return d;})
            .attr('x2', function(d){ return d;})
            .attr('fill', 'none')
            .attr('stroke', settings.grid.strokeColor)
            .attr('stroke-width', '1px')
            .attr('shape-rendering', 'crispEdges');
        grid.style('visibility', settings.grid.enable ? 'visible':'hidden');
    }
    static renderWorkspace(editor){
        // 渲染dt-canvas
        let config = editor.config;
        let settings = config.settings;
        /*<svg>
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
        </svg>*/
        // 绘制svg
        let svg = ViewUtil._drawSVGCanvas(settings);
        editor._setSVG(svg);
        let g4canvas = svg.append('svg:g').attr('class', Constant.SVG_INNER_CANVAS);
        // 绘制rect背景
        ViewUtil._drawRectAsBackground(g4canvas, settings);
        // 绘制网格grid
        let grid = g4canvas.append('svg:g').attr('class', Constant.SVG_GRID);
        ViewUtil._drawGrid(grid, settings);
        g4canvas.append('svg:g').classed(Constant.SVG_DT_LINE_GROUP, true);
        g4canvas.append('svg:g').classed(Constant.SVG_DT_NODE_GROUP, true);
        // TODO - 渲染dt-footer
    }
}

export default ViewUtil;
