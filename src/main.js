'use strict';
import $ from 'jquery'
import Vue from 'vue'
import 'normalize.css'
import Editor from './editor/Component.vue'
import Layout from './layout.vue'

window.$ = $;

Vue.component(Editor.name, Editor);

new Vue({
    el: '#layout',
    render(createElem){
        return createElem(Layout);
    }
});
