'use strict';
import VueScrollbars from 'vue-scrollbars';
import 'vue-scrollbars/dist/bundle.css';
import './editor/css/fontello/css/fontello.css';
import Editor from './editor/Component.vue';

const NodeChartFlow = {};

NodeChartFlow.install = function (Vue, options) {
    Vue.use(VueScrollbars);
    Vue.component(Editor.name, Editor);
};

if (typeof Vue !== 'undefined') {
    Vue.use(NodeChartFlow);
}

export default NodeChartFlow;
