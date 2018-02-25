'use strict';
import Vue from 'vue'

import 'normalize.css'

new Vue({
    el: '#layout',
    render(createElem){
        return createElem('p', {}, ['测试页面。。。']);
    }
});
