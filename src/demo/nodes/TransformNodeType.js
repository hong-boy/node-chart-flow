import NodeType from '../../editor/NodeType'
import Vue from 'vue'

/**
 * 数据转换
 */
class TransformNodeType extends NodeType {
    static id() {
        return 'transformNodeType';
    }

    static component() {
        Vue.component(TransformNodeType.id(), resolve=>require(['./TransformNodeType.vue'], resolve));
    }

    validate(from, to, editor) {
        let flag = true;
        editor.getRelations().forEach((lineItem) => {
            if (lineItem.to.node() === to.node()) {
                // 只允许有一个输入
                flag = false;
            }
        });
        return flag;
    }

    constructor() {
        super();
        this.icon = null;
        this.props = {};
        this.nodeTypeId = TransformNodeType.id();
        this.color = '#E8E7AF';
        // this.icon = require('../../../assets/image/node-default.png');
        this.label = '数据转换';
        this.inputs = {enable: true};
        this.outputs = {enable: true};
    }
}

export default TransformNodeType;
