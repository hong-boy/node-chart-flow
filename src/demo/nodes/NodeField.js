class NodeField {
    constructor(fieldId=null, name='', type='1', desc='', editable=false, removable=false, clearable=true, isNew=true, isFixed=false){
        this.fieldId = fieldId;
        this.fieldName = name;
        this.fieldType = type;
        this.fieldDesc = desc;
        this.editable = editable; // 是否可被编辑
        this.removable = removable; // 是否可被删除
        this.clearable = clearable; // 是否可被单独清空
        this.isNew = isNew; // 是否是新添加的字段
        this.isTruncation = false; // 是否清空字段
        this.isFixed = isFixed; // 是否是内置固定字段
    }
}

export default NodeField;
