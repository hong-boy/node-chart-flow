'use strict';
import Vue from 'vue';
import ElementUI from 'element-ui';
import Scrollbar from 'vue-scrollbars';
import NodeChartFlow from '../dist/bundle.js';
import '../dist/bundle.css';
import Layout from './demo/layout.vue';

Vue.use(ElementUI);
Vue.use(Scrollbar);
Vue.component(NodeChartFlow.name, NodeChartFlow);

new Vue({
    el: '#layout',
    render(createElem) {
        return createElem(Layout);
    },
});
