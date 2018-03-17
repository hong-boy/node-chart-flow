import { NodeType } from '../editor/Editor';

/**
 * 数据转换
 */
class TransformNodeType extends NodeType {
    static id() {
        return 'transformNodeType';
    }

    static component() {
        return (resolve) => {
 return require(['./TransformNodeType.vue'], resolve);
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
        this.nodeTypeId = TransformNodeType.id();
        this.color = '#E8E7AF';
        this.label = function (editor) {
            return '数据转换';
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

export default TransformNodeType;
