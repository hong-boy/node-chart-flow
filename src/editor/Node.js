'use strict';

class Node {
    constructor(config={}){
        // 节点ID
        this.nodeId = config.nodeId;
        // 坐标
        this.x = config.x;
        // 坐标
        this.y = config.y;
        // 节点类别
        this.catagory = config.catagory||'defaults';
        // 节点类型
        this.nodeTypeId = config.nodeTypeId;
        // 连接到当前节点的节点：array类型，形如：[nid, nid2]
        this.wires = config.wires;
        // 节点输入端口
        this.inputs = Object.assign({
            enable: true, // 是否允许有数据源输入
            max: 1, // 最多允许的数据源数量：n-允许有n个输入（默认：n=1）
            tip: '', // 鼠标悬停在输入端口按钮时显示的信息
        }, config.inputs);
        // 节点输出端口
        this.outputs = Object.assign({
            enable: true, // 是否允许有数据源输出
            max: 9999, // 最多允许输出的数量：n-允许有n个输出（默认：n=9999）
            tip: '', // 鼠标悬停在输出端口按钮时显示的信息
        }, config.outputs);
        // 节点背景色
        this.color = config.color||'#DEB887';
        // 节点label：字符串或者function
        this.label = config.label||'';
        // 节点图标
        this.icon = config.icon||null;
        // 节点自定义属性（业务属性）
        this.props = config.props||{};
    }
}

export default Node;
