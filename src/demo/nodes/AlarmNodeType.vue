<template>
    <el-row class="alarm-node-type node-type">
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
                                <el-form-item label="告警名称" prop="name">
                                    <el-input v-model.trim="form.name"
                                              placeholder="请输入告警名称"
                                              @blur="updateNodeLabel">
                                        <template slot="prepend">{{form.prefix}}</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="描述">
                                    <el-input v-model.trim="form.desc" placeholder="请输入描述" :maxlength="80"></el-input>
                                </el-form-item>
                                <el-form-item label="数据源" prop="source">
                                    <el-input v-model.trim="form.source" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="是否存储" class="inline-form-item">
                                    <el-switch v-model="form.storage"
                                               :active-value="1"
                                               :inactive-value="0"></el-switch>
                                </el-form-item>
                            </el-collapse-item>
                            <el-collapse-item title="输出字段" name="outputFields">
                                <fields_config :form.sync="form" :DATA_TYPE_LIST="DATA_TYPE_LIST"></fields_config>
                            </el-collapse-item>
                            <el-collapse-item title="脚本配置" name="scriptConfig">
                                <el-form-item label="显示调试信息" class="inline-form-item">
                                    <el-switch v-model="form.debug"
                                               :active-value="1"
                                               :inactive-value="0"></el-switch>
                                </el-form-item>
                                <el-form-item label="WHERE：" prop="script4where">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                        placeholder="请输入脚本"
                                        v-model.trim="form.script4where"></el-input>
                                </el-form-item>
                                <el-form-item label="SELECT：">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                        placeholder="请输入脚本"
                                        v-model="form.script4select"></el-input>
                                </el-form-item>
                                <el-form-item label="告警信息：">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                        placeholder="请输入告警信息"
                                        v-model="form.warnInfo"></el-input>
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
    import NodeDesc from './AlarmNodeDescriptor.vue'
    import IOT from './IOT.mock.js'

    // 默认字段
    const DEFAULT_FIELDS = [
        new NodeField(null, 'warnInfo', '1', '固定字段', false, false, false, false, true),
        new NodeField(null, 'eventTime', '9', '固定字段', false, false, false, false, true),
    ];

    class FormBean {
        constructor(){
            this.id = null; // 后台ID
            this.prefix = PREFIX;
            this.name = 'alarm'; // 节点名称（不带前缀）
            this.desc = null; // 描述
            this.source = null; // 数据来源
            this.storage = 1; // 是否存储 1-存储 0-不存储
            this.debug = 1; // 是否打印调试信息 1-展示 0-不展示
            this.warnInfo = null; // 告警信息
            this.script4where = null; // 脚本
            this.script4select = null; // 脚本
            this.fields = [].concat(DEFAULT_FIELDS);
        }
    }

    let userInfo = IOT.loadUserInfo();

    const DATA_TYPE_LIST = userInfo.dataTypeList;
    const PREFIX = userInfo.prefixList.ALARM_NODE;

    export default {
        name: 'alarmNodeType',
        props: ['node', 'editor'],
        components: {
            fields_config: FieldsConfig,
            node_desc: NodeDesc,
        },
        created(){
            let thiz = this;

            thiz.form = IOT.$.extend(true, thiz.form, thiz.node.props);
            thiz.node.props = thiz.form;

            thiz.$nextTick(function () {
                thiz.refreshNodeSource();
                thiz.updateNodeLabel();
//                thiz.$refs.form.validate();
            });
        },
        data(){
            var validName = (rule, value,callback)=>{
                let thiz = this;
                let nodeList = thiz.editor.getNodeListByNodeType('alarmNodeType');
                let list = nodeList.filter(
                    item=>(item.nodeId !== thiz.node.nodeId
                    && item.props.name.toLowerCase() === value.toLowerCase())
                );
                if(list.length){
                    callback(new Error('名称已存在'))
                }else if(!/^[0-9a-zA-Z_]{1,}$/.test(value)){
                    callback(new Error('只能以字母数字下划线组成'));
                }else {
                    callback();
                }
            };

            return {
                DATA_TYPE_LIST: DATA_TYPE_LIST,
                form: new FormBean(),
                rules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { max: 20, message: '长度不超过 20 个字符', trigger: 'blur' },
                        { required: true, trigger: 'blur', validator: validName }
                    ],
                    source: [
                        { required: true, message: '请配置数据来源', trigger: 'blur' }
                    ],
                    script4where: [
                        { required: true, message: '请配置WHERE脚本', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            refreshNodeSource(){
                // 刷新source字段
                let thiz = this;
                let prev = thiz.node.prev;
                if(prev.length){
                    let prevNodeId = prev[0];
                    let prevDatum = thiz.editor.getNodeDatumById(prevNodeId);
                    prevDatum && (thiz.node.props.source = [prevDatum.props.prefix, prevDatum.props.name].join(''));
                }
            },
            updateNodeLabel(){
                this.editor.updateNodeLabel(this.node.nodeId, [this.form.prefix, this.form.name].join(''));
            },
        }
    }
</script>

<style lang="less">
</style>
