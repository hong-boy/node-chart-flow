import Vue from 'vue'
import NodeType from '../../editor/NodeType'

const NODE_DESC = require('./node_desc.json');

/**
 * 告警
 */
class AlarmNodeType extends NodeType {
    static id() {
        return 'alarmNodeType';
    }

    static component() {
        Vue.component(AlarmNodeType.id(), resolve=>require(['./AlarmNodeType.vue'], resolve));
    }

    static tip() {
        return NODE_DESC.ALARM;
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
        this.props = {};
        this.nodeTypeId = AlarmNodeType.id();
        // this.icon = require('../../../assets/image/node-default.png');
        this.color = '#E59191';
        this.label = '告警';
        this.inputs = {enable:true};
        this.outputs = {
            enable: false,
        };
    }
}

export default AlarmNodeType;
