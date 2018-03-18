import Vue from 'vue';
import { NodeType } from '../../dist/bundle.js';

const NODE_DESC = require('./node_desc.json');

/**
 * 告警
 */
class AlarmNodeType extends NodeType {
    static id() {
        return 'alarmNodeType';
    }

    static component() {
        Vue.component(AlarmNodeType.id(), (resolve) => {
 return require(['./AlarmNodeType.vue'], resolve);
});
    }

    static tip() {
        return NODE_DESC.ALARM;
    }

    validate(from, to, editor) {
        let flag = true;
        editor.getRelations().forEach((lineItem) => {
            console.log(lineItem.to, to, lineItem.to === to);
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
        this.icon = require('../editor/css/icon/default.png');
        this.color = '#E59191';
        this.label = '告警';
        this.inputs = {
            enable: true,
            max: 1,
            tip: '描述...',
        };
        this.outputs = {
            enable: false,
        };
    }
}

export default AlarmNodeType;
