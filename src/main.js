'use strict';
import Vue from 'vue'
import 'normalize.css'
import Editor from './editor/Component.vue'
import Layout from './layout.vue'

Vue.component(Editor.name, Editor);

new Vue({
    el: '#layout',
    render(createElem){
        return createElem(Layout);
    }
});
