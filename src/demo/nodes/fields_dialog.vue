<template>
    <el-form class="form node-type-form"
             ref="form"
             label-position="top"
             label-width="100px"
             :model="form"
             :rules="rules"
             @submit.native.prevent>
        <el-form-item label="字段名" prop="fieldName">
            <el-input v-model.trim="form.fieldName" placeholder="请输入字段名称"></el-input>
        </el-form-item>
        <el-form-item label="字段类型">
            <el-select v-model="form.fieldType"
                       style="width: 100%;"
                       :disabled="mode==='edit' && !field.isNew">
                <el-option v-for="(val, key) in dataTypeList" :key="key" :label="val" :value="key"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="字段描述" prop="fieldDesc">
            <el-input v-model.trim="form.fieldDesc" placeholder="请输入字段描述"></el-input>
        </el-form-item>
        <el-form-item class="text-center">
            <el-button v-if="mode === 'add'" class="btn" type="primary" @click="saveHandler('add')">保存</el-button>
            <el-button v-if="mode === 'add'" class="btn" @click="saveHandler('add', true)">保存并添加新字段</el-button>
            <el-button v-if="mode === 'edit'" class="btn" type="primary" @click="saveHandler('edit')">保存</el-button>
            <el-button v-if="mode === 'edit'" class="btn" @click="cancelHandler()">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script type="text/ecmascript-6">


    export default {
        props: ['mode', 'field', 'dataTypeList', 'save', 'cancel', 'fieldList'],
        created(){
            let {fieldName, fieldType, fieldDesc} = this.field;
            this.form.fieldName = fieldName;
            this.form.fieldType = fieldType;
            this.form.fieldDesc = fieldDesc;
        },
        data(){
            var validName = (rule, value,callback)=>{
                let thiz = this;
                let list = thiz.fieldList.filter(item=>(item !== thiz.field && item.fieldName === value));
                if(list.length){
                    callback(new Error('字段名称已存在'))
                }else if(!/^[A-Za-z_][A-Za-z_0-9]+$/.test(value)){
                    callback(new Error('只能以字母数字下划线组成，不能以数字开头'));
                }else {
                    callback();
                }
            };

            return {
                form: {
                    fieldName: '',
                    fieldType: '',
                    fieldDesc: '',
                },
                rules: {
                    fieldName: [
                        { required: true, message: '请输入字段名称', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
                        { required: true, trigger: 'blur', validator: validName }
                    ],
                    fieldDesc: [
                        { max: 60, message: '长度不超过 60 个字符', trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            saveHandler(mode, continues){
                let thiz = this;
                thiz.$refs['form'].validate(function (valid) {
                    if(valid){
                        thiz.$emit('save', mode, thiz.form);
                        if(!continues){
                            thiz.$emit('cancel');
                            return;
                        }
                        // 保存并继续添加字段
                        thiz.form = {
                            fieldName: '',
                            fieldType: '1',
                            fieldDesc: ''
                        };
                    }
                });
            },
            cancelHandler(){
                this.$emit('cancel');
            }
        }
    }
</script>

<style lang="less">
    .form.node-type-form {
    .el-form-item {
        margin-bottom: 15px;
    }
    .el-form-item__label {
        padding: 0;
        line-height: 30px;
    }
    }
</style>
