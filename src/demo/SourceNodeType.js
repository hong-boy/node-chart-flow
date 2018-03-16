import {NodeType} from '../editor/Editor'

/**
 * 开始节点
 */
class SourceNodeType extends  NodeType {
    static id(){
        return 'sourceNodeType';
    }
    static component(){
        return resolve=>require(['./SourceNodeType.vue'], resolve);
    }
    validate(from, to, editor){
        return true;
    }
    constructor(){
        super();
        this.props = {};
        this.nodeTypeId = SourceNodeType.id();
        this.color = '#A6BBCE';
        this.label = '开始';
        this.outputs = {
            enable: true,
            tip: '描述...'
        };
        this.inputs = {
            enable: false,
        };
    }
}

export default SourceNodeType;
