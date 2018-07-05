import NodeType from '../../editor/NodeType'
import Vue from 'vue'

/**
 * 开始节点
 */
class SourceNodeType extends NodeType {
    static id() {
        return 'sourceNodeType';
    }

    static component() {
        Vue.component(SourceNodeType.id(), resolve=>require(['./SourceNodeType.vue'], resolve));
    }

    validate(from, to, editor) {
        return true;
    }

    constructor() {
        super();
        this.props = {};
        this.nodeTypeId = SourceNodeType.id();
        this.color = '#A6BBCE';
        // this.icon = require('../../../assets/image/node-default.png');
        this.label = '开始';
        this.outputs = {
            enable: true,
        };
        this.inputs = {
            enable: false,
        };
    }
}

export default SourceNodeType;
