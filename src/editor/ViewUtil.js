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
    static getNodeTpl4SVG(nodeTypeConfig, editor){
        // .dt-canvas
        /*<g class="dt-node" id="">
            <rect class="node-rect"></rect>
            <g class="node-icon-group">
                <rect class="shape"></rect>
                <span class="icon"></span>
                <path class="shape-border"></path>
            </g>
            <text class="node-label"></text>
            <g class="port inputs">
                <rect class="node-port"></rect>
            </g>
            <g class="port outputs">
                <rect class="node-port"></rect>
            </g>
             <span class="node-status error"></span>
             <span class="node-status changed"></span>
        </g>*/
        let g = editor.getSVG().select(`.${Constant.SVG_INNER_CANVAS}`);
        let g4node = g.append('svg:g').attr('class', Constant.SVG_DT_NODE);
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
        g4icons.append('span').attr('class', `icon ${nodeTypeConfig.icon}`);
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
        g4node.append('svg:g')
            .attr('class', 'port inputs')
            .append('svg:rect')
            .attr('class', 'node-port')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('width', 10)
            .attr('height', 10);
        // g.port.outputs
        g4node.append('svg:g')
            .attr('class', 'port outputs')
            .append('svg:rect')
            .attr('class', 'node-port')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('width', 10)
            .attr('height', 10);
        // span.node-status.error
        g4node.append('span')
            .attr('class', 'node-status error');
        // span.node-status.changed
        g4node.append('span')
            .attr('class', 'node-status changed');

        return g4node;
    }
    static getNodeTpl4Palette(nodeTypeConfig, editor){
        // 获取节点html模板 - .dt-palette
        let $tpl = $(
            '<div class="node-tpl">' +
            `<div class="node-label">${$.isFunction(nodeTypeConfig.label) ? nodeTypeConfig.label.call(null, editor) : nodeTypeConfig.label}</div>` + // 节点label
            `<div class="node-icon-container"><span class="${nodeTypeConfig.icon||''}"></span></div>` + // 节点icon
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
        return width;
    }
    static _updateNodeSize(node4svg, editor){
        // 更新节点尺寸
        let labelTxt = node4svg.select('.node-label').text();
        let width = ViewUtil._calcTextWidth(labelTxt);
        let width4rect = Math.max(width + Constant.SVG_WIDTH_OF_NODE_ICON, Constant.SVG_MIN_WIDTH_OF_NODE_RECT);
        node4svg.select(`.${Constant.SVG_NODE_RECT}`).attr('width', width4rect);
        editor.log('updateNodeSize', width, width4rect);
    }
    static _dragNodeOnCanvas(editor){
        // 在画布中定义节点的拖拽行为
        let inst4drag = ViewUtil.inst4drag;
        // let inst4drag;
        return function () {
            if(!inst4drag){
                console.log('111111111');
                let start = function (d){
                    d3.event.x = d.x;
                    d3.event.y = d.y;
                    editor.log('node (g) drag start...', d, d3.event.x, d3.event.y, this.parentNode, d3.event.target);
                };
                let drag = function (d){
                    // editor.log('node (g) draging...', d, d3.event.x, d3.event.y);
                    ViewUtil.transform(d3.select(this), d3.event.x, d3.event.y);
                };
                let end = function (d){
                    let x = d3.event.x;
                    let y = d3.event.y;
                    d.x = x;
                    d.y = y;
                    editor.log('node (g) drag end...', d, x, y);
                };
                inst4drag = ViewUtil.inst4drag = d3.drag()
                    .on('start', start)
                    .on('drag', drag)
                    .on('end', end);
            }
            return inst4drag;
        };
    }
    static _drawNodeOnCanvas(config, editor){
        // 添加节点到画布
        let node4svg = ViewUtil.getNodeTpl4SVG(config, editor);
        node4svg.datum(config);
        ViewUtil.transform(node4svg, config.x, config.y);
        ViewUtil._updateNodeSize(node4svg, editor);
        // TODO - 给节点绑定拖拽事件
        node4svg.call(ViewUtil._dragNodeOnCanvas(editor)());
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
        // TODO - 渲染dt-footer
    }
}

export default ViewUtil;
