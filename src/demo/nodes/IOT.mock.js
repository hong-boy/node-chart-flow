'use strict';
// mock of IOT

import jQuery from 'jquery'
const $ = (()=>jQuery)();

export default {
    $,
    loadUserInfo(){
        return {
            dataTypeList: {
                '1': 'String',
                '2': 'Int',
                '3': 'Float',
                '4': 'Boolean',
                '5': 'Long',
                '6': 'Double',
                '7': 'Date',
                '9': 'Timestamp',
            },
            prefixList: {
                TRANSFORM_NODE: 'Trans_',
                STATS_NODE: 'Stats_',
                ALARM_NODE: 'Alarm_',
            },
        };
    }
}
