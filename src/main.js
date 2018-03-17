'use strict';
import Vue from 'vue'
import ElementUI from 'element-ui'
import NodeChartFlow from '../dist/bundle.js'
import '../dist/bundle.css'
import Layout from './demo/layout.vue'

console.log(NodeChartFlow);

Vue.use(ElementUI);
Vue.use(NodeChartFlow);

new Vue({
    el: '#layout',
    render(createElem) {
        return createElem(Layout);
    },
});
