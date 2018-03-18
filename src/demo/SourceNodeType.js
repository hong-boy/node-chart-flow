import Vue from 'vue';
import { NodeType } from '../../dist/bundle.js';

/**
 * 开始节点
 */
class SourceNodeType extends NodeType {
    static id() {
        return 'sourceNodeType';
    }

    static component() {
        Vue.component(SourceNodeType.id(), (resolve) => {
 return require(['./SourceNodeType.vue'], resolve);
});
    }

    validate(from, to, editor) {
        return true;
    }

    constructor() {
        super();
        this.props = {
            id: '',
            name: '',
            script: '',
            fields: [],
        };
        this.nodeTypeId = SourceNodeType.id();
        this.color = '#A6BBCE';
        this.label = '开始';
        this.outputs = {
            enable: true,
            tip: '描述...',
        };
        this.inputs = {
            enable: false,
        };
    }
}

export default SourceNodeType;
