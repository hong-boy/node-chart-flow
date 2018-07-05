import NodeType from '../../editor/NodeType'
import Vue from 'vue'

/**
 * 数据统计
 */
class StatsNodeType extends NodeType {
    static id() {
        return 'statsNodeType';
    }

    static component() {
        Vue.component(StatsNodeType.id(), resolve=>require(['./StatsNodeType.vue'], resolve));
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
        this.nodeTypeId = StatsNodeType.id();
        // this.icon = require('../../../assets/image/node-default.png');
        this.color = '#C2EDC0';
        this.label = '数据统计';
        this.inputs = {enable: true};
        this.outputs = {enable: true};
    }
}

export default StatsNodeType;
