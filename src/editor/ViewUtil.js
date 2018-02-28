'use strict';
import * as d3 from 'd3'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/accordion.js'
import 'jquery-ui/ui/widgets/draggable.js'
import 'jquery-ui/ui/widgets/droppable.js'
import 'jquery-ui/themes/base/accordion.css'
import 'jquery-ui/themes/base/draggable.css'
import Constant from './Constant.js'

class ViewUtil {
    static getNodeTpl4SVG(nodeTypeConfig, editor){
        // .dt-canvas
        /*<g class="dt-node">
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
            .text('nodeTypeConfig.label'); // TODO - 显示默认名称
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
    static getNodeTpl4Palette(nodeTypeConfig){
        // 获取节点html模板 - .dt-palette
        let $tpl = $(
            '<div class="node-tpl">' +
            `<div class="node-label">${$.isFunction(nodeTypeConfig.label) ? nodeTypeConfig.label.call(nodeTypeConfig) : nodeTypeConfig.label}</div>` + // 节点label
            `<div class="node-icon-container"><span class="${nodeTypeConfig.icon||''}"></span></div>` + // 节点icon
            (nodeTypeConfig.inputs.enable ? '<div class="node-port node-port-inputs"></div>' : '') + // 节点输入端口
            (nodeTypeConfig.outputs.enable ? '<div class="node-port node-port-outputs"></div>' : '') + // 节点输出端口
            '</div>'
        );
        $tpl.data(Constant.PALETTE_NODE_CONFIG, nodeTypeConfig);
        nodeTypeConfig.color && $tpl.css('background-color', nodeTypeConfig.color);
        return $tpl;
    }
    static renderCatagory(catagory, $palette){
        // 渲染节点类别列表
        if(catagory && catagory.list){
            let arr = [];
            catagory.list.forEach(cata=>{
                arr.push(
                    `<header class="cata-label">${cata.label}</header>` +
                    `<section class="cata-section" id="${Constant.PREFIX_OF_CATAGORY+cata.id}"></section>`
                );
            });
            $palette.append(arr.join(''));
        }
    }
    static renderPalette(editor){
        let $palette = editor.$palette;
        let config = editor.config;
        ViewUtil.renderCatagory(config.palette.catagory, $palette);
        editor.getNodeType().forEach((nodeTypeConfig, nodeTypeId)=>{
            let $nodePaletteTpl = ViewUtil.getNodeTpl4Palette(nodeTypeConfig);
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
    static dragAndDrop4Palette(editor){
        // 绑定拖拽事件 - dt-palette
        let start = function (e, ui) {
            let nodeTypeConfig = $(e.target).data(Constant.PALETTE_NODE_CONFIG);
            ui.helper.data(Constant.PALETTE_NODE_CONFIG, nodeTypeConfig);
            editor.log('dragstart...', nodeTypeConfig);
        };
        let drag = function(e, ui){
            // editor.log('dragging...');
        };
        let drop = function(e, ui){
            let offset = ui.offset;
            let offset4thiz = $(this).offset();
            let nodeTypeConfig = ui.helper.data(Constant.PALETTE_NODE_CONFIG);
            let node4svg = ViewUtil.getNodeTpl4SVG(nodeTypeConfig, editor);
            node4svg.attr('transform', `translate(${offset.left - offset4thiz.left}, ${offset.top - offset4thiz.top})`);
            editor.log('drop...', offset, $(this).offset(), node4svg.attr('transform'));
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
