<template>
    <el-row class="prop-row-box">
        <div class="prop-row" v-for="field in form.fields" :key="field.fieldName">
            <span :class="['f-name f-item', field.editable ? ' link':'']"
                  @click="editFieldDialog(field)"
                  :title="field.fieldName">{{field.fieldName}}</span>
            <span class="f-spliter f-item">|</span>
            <span class="f-type f-item">{{field.fieldType | dataTypeFilter}}</span>
            <span class="f-opt f-item">
                <i class="link icon-delete-2" v-if="field.removable"
                   @click="deleteField(field)" title="删除字段"></i>
                <i class="link reply icon-reply-2" v-if="!field.isNew && field.clearable && field.isTruncation"
                      @click="truncate(field, false)"
                      title="取消清空该字段的值"></i>
                <i class="link clear icon-clear" v-if="!field.isNew && field.clearable && !field.isTruncation"
                      @click="truncate(field, true)"
                      title="清空该字段的值"></i>
            </span>
        </div>
        <span class="f-add link" @click="addFieldDialog">添加新字段</span>
        <!-- 对话框 - 添加或者编辑字段 -->
        <el-dialog class="dialog"
                   :visible.sync="dialog.visible"
                   width="500px"
                   :append-to-body="true"
                   :close-on-click-modal="false"
                   :close-on-press-escape="true"
                   @close="onDialogClose">
            <div slot="title">{{dialog.mode === 'add' ? '添加新字段':'编辑字段'}}</div>
            <component :is="dialog.compt"
                       :mode="dialog.mode"
                       :field="dialog.field"
                       :fieldList="form.fields"
                       :dataTypeList="DATA_TYPE_LIST"
                       @save="saveField"
                       @cancel="cancelField"></component>
        </el-dialog>
        <!-- 确认框 - 删除字段 -->
        <el-dialog class="dialog confirm"
                   :append-to-body="true"
                   :visible.sync="confirm.visible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="true">
            <div slot="title">温馨提示</div>
            <div>
                <div>确定要删除字段 {{confirm.field && confirm.field.fieldName}} 吗？</div>
                <span class="tip error">（将会删除该字段下的全部数据，且不可恢复！）</span>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="deleteFieldHandler">确定</el-button>
                <el-button @click="confirm.visible = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- 确认框 - 清空字段 -->
        <el-dialog class="dialog confirm"
                   :append-to-body="true"
                   :visible.sync="confirmTruncation.visible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="true"
                   @close="onConfirmTruncationClose">
            <div slot="title">温馨提示</div>
            <div>
                <div>确定要清空字段 {{confirmTruncation.field && confirmTruncation.field.fieldName}} 吗？</div>
                <span class="tip error">（将会清空该字段下的全部数据，且不可恢复！）</span>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="truncationHandler">确定</el-button>
                <el-button @click="confirmTruncation.visible = false">取消</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script type="text/ecmascript-6">
    import NodeField from './NodeField'
    import FieldsDialog from './fields_dialog.vue'

    export default {
        props: ['form', 'DATA_TYPE_LIST'],
        components: {
            fields_dialog: FieldsDialog
        },
        created(){
        },
        data(){
            return {
                dialog: {
                    compt: '',
                    visible: false,
                    mode: null, // add-添加  edit-编辑
                    field: {},
                    originalField: {}, // 存放修改前的字段实例
                },
                confirm: {
                    visible: false,
                    field: null,
                },
                confirmTruncation: {
                    visible: false,
                    field: null,
                    isTruncation: null,
                },
            };
        },
        methods: {
            onConfirmTruncationClose(){
                let thiz = this;
                thiz.confirmTruncation.field = null;
                thiz.confirmTruncation.isTruncation = null;
            },
            truncate(field, isTruncation){
                let thiz = this;
                if(isTruncation){
                    // 若为清空，则给出确认提示
                    thiz.confirmTruncation.visible = true;
                    thiz.confirmTruncation.field = field;
                    thiz.confirmTruncation.isTruncation = isTruncation;
                }else {
                    // 取消清空，直接执行
                    field.isTruncation = isTruncation;
                    thiz.$forceUpdate();
                }
            },
            truncationHandler(){
                let thiz = this;
                let field = thiz.confirmTruncation.field;
                field.isTruncation = thiz.confirmTruncation.isTruncation;
                thiz.$forceUpdate();
                thiz.confirmTruncation.visible = false;
            },
            cancelField(){
                this.dialog.visible = false;
            },
            onDialogClose(){
                this.dialog.mode = null;
                this.dialog.field = null;
                this.dialog.originalField = null;
                this.dialog.compt = null;
            },
            deleteField(field){
                // 删除字段（提示框）
                if(!field.removable){
                    return;
                }
                let thiz = this;
                if(field.isNew){
                    // 若为新字段，则直接删除
                    thiz.confirm.field = field;
                    thiz.deleteFieldHandler();
                }else {
                    // 弹出提示框
                    thiz.confirm.visible = true;
                    thiz.confirm.field = field;
                }
            },
            deleteFieldHandler(){
                let field = this.confirm.field;
                let pos = this.form.fields.indexOf(field);
                if(pos !== -1){
                    this.form.fields.splice(pos, 1);
                }
                this.confirm.visible = false;
            },
            saveField(mode, field){
                if(mode === 'add'){
                    // 添加新字段
                    let newField = new NodeField(null, field.fieldName, field.fieldType, field.fieldDesc, true, true, true, true);
                    this.form.fields.push(newField);
                }else {
                    // 编辑字段
                    let origField = this.dialog.field;
                    let {fieldName, fieldType, fieldDesc} = field;
                    origField.fieldName = fieldName;
                    origField.fieldType = fieldType;
                    origField.fieldDesc = fieldDesc;
                }
            },
            editFieldDialog(field){
                // 编辑字段
                if(!field.editable){
                    return;
                }
                let thiz = this;
                this.dialog.compt = 'fields_dialog';
                thiz.dialog.visible = true;
                thiz.dialog.mode = 'edit';
                thiz.dialog.field = field;
            },
            addFieldDialog(){
                // 添加新字段
                let thiz = this;
                this.dialog.compt = 'fields_dialog';
                thiz.dialog.visible = true;
                thiz.dialog.mode = 'add';
                let field = new NodeField();
                field.editable = true;
                field.removable = true;
                thiz.dialog.field = field;
            }
        }
    }
</script>

<style lang="less"></style>
