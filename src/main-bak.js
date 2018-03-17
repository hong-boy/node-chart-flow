'use strict';
import $ from 'jquery';
import * as d3 from 'd3';
import Vue from 'vue';
import ElementUI from 'element-ui';
import VueScrollbars from 'vue-scrollbars';
import 'normalize.css';
import 'vue-scrollbars/dist/bundle.css';
import './editor/css/fontello/css/fontello.css';
import Editor from './editor/Component.vue';
import Layout from './demo/layout.vue';

window.$ = $;
window.d3 = d3;

Vue.use(ElementUI);
Vue.use(VueScrollbars);
Vue.component(Editor.name, Editor);

new Vue({
    el: '#layout',
    render(createElem) {
        return createElem(Layout);
    },
});
