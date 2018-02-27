'use strict';
import $ from 'jquery'
import 'jquery-ui/ui/widgets/accordion.js'
import 'jquery-ui/ui/widgets/draggable.js'
import 'jquery-ui/ui/widgets/droppable.js'
import 'jquery-ui/themes/base/accordion.css'
import 'jquery-ui/themes/base/draggable.css'
import Constant from './Constant.js'

class Util {
    static getNodeTpl4Palette(nodeTypeConfig){
        // 获取节点html模板
        let $tpl = $(
            '<div class="node-tpl">' +
            `<div class="node-label">${$.isFunction(nodeTypeConfig.label) ? nodeTypeConfig.label.call(nodeTypeConfig) : nodeTypeConfig.label}</div>` + // 节点label
            `<div class="node-icon-container"><span class="${nodeTypeConfig.icon||''}"></span></div>` + // 节点icon
            (nodeTypeConfig.inputs.enable ? '<div class="node-port node-port-inputs"></div>' : '') + // 节点输入端口
            (nodeTypeConfig.outputs.enable ? '<div class="node-port node-port-outputs"></div>' : '') + // 节点输出端口
            '</div>'
        );
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
        let $canvas = editor.$canvas;
        let config = editor.config;
        Util.renderCatagory(config.palette.catagory, $palette);
        editor.getNodeType().forEach((nodeTypeConfig, nodeTypeId)=>{
            let $nodePaletteTpl = Util.getNodeTpl4Palette(nodeTypeConfig);
            let $nodeWrapper = $palette.find(`#${Constant.PREFIX_OF_CATAGORY + nodeTypeConfig.catagory}`);
            $nodeWrapper.append($nodePaletteTpl);
        });
        // 渲染手风琴
        $palette.accordion({
            header:'.cata-label',
            collapsible: false,
        });
        // 绑定拖拽事件
        Util.dragAndDrop($palette, $canvas);
    }
    static dragAndDrop($palette, $canvas){
        // 绑定拖拽事件
        let start = function (e, ui) {
            console.log('start...');
        };
        let drag = function(e, ui){
            console.log('dragging...');
        };
        let drop = function(e, ui){
            console.log('drop...');
        };
        let over = function(e, ui){
            console.log('over...');
        };
        $('.node-tpl', $palette).draggable({
            helper: 'clone',
            start,
            drag,
        });
        $canvas.droppable({
            accept: '.node-tpl',
            tolerance: 'fit',
            drop,
            over,
        });
    }
}

export default Util;
