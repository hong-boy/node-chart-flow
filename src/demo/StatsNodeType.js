import { NodeType } from '../editor/Editor';

/**
 * 数据统计
 */
class StatsNodeType extends NodeType {
    static id() {
        return 'statsNodeType';
    }

    static component() {
        return (resolve) => {
 return require(['./StatsNodeType.vue'], resolve);
};
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
        this.color = '#C2EDC0';
        this.label = function (editor) {
            return '数据统计';
        };
        this.inputs = {
            enable: true,
            tip: '描述...',
        };
        this.outputs = {
            enable: true,
            tip: '描述...',
        };
    }
}

export default StatsNodeType;
