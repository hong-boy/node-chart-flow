'use strict';
import Vue from 'vue';
import ElementUI from 'element-ui';
import Scrollbar from 'vue-scrollbars';
import './editor/css/main.less';
import NodeChartFlow from './editor/Component.vue';
import Layout from './demo/nodes/layout.vue';
import IOT from './demo/nodes/IOT.mock.js'

Vue.filter('dataTypeFilter', function(value){
    let list = IOT.loadUserInfo().dataTypeList;
    return list[value];
});
Vue.use(ElementUI);
Vue.use(Scrollbar);
Vue.component(NodeChartFlow.name, NodeChartFlow);

new Vue({
    el: '#layout',
    render(createElem) {
        return createElem(Layout);
    },
});
