<template>
    <el-row class="source-node-type node-type">
        <el-tabs type="border-card">
            <el-tab-pane label="属性配置" class="prop">
                <div class="scrollbar-macosx form-wrap" v-bar>
                    <el-form class="form"
                             ref="form"
                             label-position="top"
                             label-width="100px"
                             :model="form"
                             :rules="rules"
                             @submit.native.prevent>
                        <el-collapse :value="['basic', 'outputFields', 'scriptConfig']">
                            <el-collapse-item title="基本信息" name="basic">
                                <el-form-item label="数据流名称" prop="name">
                                    <el-input v-model.trim="form.name"
                                              :maxlength="80"
                                              placeholder="请输入OneNET数据流名称"
                                              @blur="updateNodeLabel">
                                    </el-input>
                                </el-form-item>
                            </el-collapse-item>
                            <el-collapse-item title="输出字段" name="outputFields">
                                <fields_config :form.sync="form" :DATA_TYPE_LIST="DATA_TYPE_LIST"></fields_config>
                            </el-collapse-item>
                            <el-collapse-item title="脚本配置" name="scriptConfig">
                                <el-form-item label="SELECT：" prop="script">
                                    <el-input
                                        type="textarea"
                                        spellcheck="false"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                        placeholder="请输入脚本"
                                        v-model="form.script"></el-input>
                                </el-form-item>
                            </el-collapse-item>
                        </el-collapse>
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="节点说明">
                <div class="scrollbar-macosx form-wrap" v-bar>
                    <node_desc></node_desc>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<script type="text/ecmascript-6">
    import NodeField from './NodeField'
    import FieldsConfig from './fields_config.vue'
    import NodeDesc from './SourceNodeDescriptor.vue'
    import IOT from './IOT.mock.js'

    // 默认字段
    const DEFAULT_FIELDS = [
        new NodeField(null, 'eventTime', '9', '固定字段', false, false, false, false, true),
    ];

    class FormBean {
        constructor() {
            this.id = null; // 后台ID
            this.name = ''; // 数据流（不设默认值）
            this.script = null;
            this.fields = [].concat(DEFAULT_FIELDS);
        }
    }

    export default {
        name: 'sourceNodeType',
        props: ['node', 'editor'],
        components: {
            fields_config: FieldsConfig,
            node_desc: NodeDesc,
        },
        created(){
            let thiz = this;
            thiz.DATA_TYPE_LIST = IOT.loadUserInfo().dataTypeList;

            // TODO - 考虑固定字段已经存在的情况
            thiz.form = IOT.$.extend(true, thiz.form, thiz.node.props);
            thiz.node.props = thiz.form;

            thiz.$nextTick(function () {
                thiz.updateNodeLabel();
//                thiz.$refs.form.validate();
            });
        },
        data(){
            var validName = (rule, value, callback) => {
                let thiz = this;
                let nodeList = thiz.editor.getNodeListByNodeType('sourceNodeType');
                // 不区分大小写
                let list = nodeList.filter(
                    item => (item.nodeId !== thiz.node.nodeId && item.props.name.toLowerCase() === value.toLowerCase())
                );
                if (list.length) {
                    callback(new Error('数据源名称已存在'))
                } else {
                    callback();
                }
            };

            return {
                DATA_TYPE_LIST: {},
                form: new FormBean(),
                rules: {
                    name: [
                        {required: true, message: '请输入数据流名称', trigger: 'blur'},
                        {max: 80, message: '长度不超过 80 个字符', trigger: 'blur'},
                        {required: true, trigger: 'blur', validator: validName}
                    ],
                    script: [
                        {required: true, message: '请输入脚本配置', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            updateNodeLabel(){
                this.editor.updateNodeLabel(this.node.nodeId, this.form.name);
            }
        }
    }
</script>

<style lang="less">
</style>
