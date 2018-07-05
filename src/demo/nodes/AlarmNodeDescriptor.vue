<template>
    <el-row class="node-descriptor" v-pre>
        <p>
            <b>告警节点</b>，用于对异常数据进行告警，并输出相应告警信息，告警节点后不能再有其它节点。
        </p>
        <p><b>基本信息：</b></p>
        <ul>
            <li><code>告警名称</code>：代表当前节点所对应的表名称；有一个固定前缀<code>Alarm_</code></li>
            <li><code>数据源</code>：代表当前节点的数据来源；数据源为上一节点的输出字段</li>
            <li><code>是否存储</code>：代表是否需要存储当前节点的数据结果；
                若为否，则系统不会对该节点的数据进行存储，同时流计算测试中也不会打印出测试数据
            </li>
        </ul>
        <p><b>输出字段：</b>代表当前节点的数据输出。</p>
        <ul>
            <li>
                <code>eventTime</code>：
                事件时间，取值为数据点上传到OneNET的时间；固定字段。
            </li>
            <li>
                <code>warnInfo</code>：告警信息；固定字段。
            </li>
        </ul>
        <p>
            <b>脚本配置：</b>配置告警的规则。可供使用的字段为上一节点的输出字段。
        </p>
        <ul>
            <li><code>显示调试信息</code>：进行流计算测试的时候，是否打印出当前节点的输出字段和数据结果。</li>
            <li>
                <code>WHERE</code>：
                必填，表示告警的条件，如需对传入字段"avgT"值大于30时告警，则脚本为：
                <code class="blk">
                    where(avg_temperature > 30)
                </code>
            </li>
            <li>
                <code>SELECT</code>：
                必填，用于定义需要保存的报警字段，脚本示例如下：
                <code class="blk">
                    select(avg_temperature as alarmT)
                </code>
            </li>
            <li>
                <code>warnInfo</code>：
                非必填，用于定义需要保存的报警信息，可以使用<code>${FIELD}</code>表示相应字段的数据值，脚本示例如下：
                <code class="blk">
                    warnInfo(平均温度大于30！当前值为${alarmT})
                </code>
            </li>
        </ul>
        <p>以下是脚本配置示例：</p>
        <ul>
            <li>
                示例1：假设传入字段<code>avgT</code>代表平均温度，当平均温度大于30时告警，告警信息为
                "平均温度大于30！当前温度为："并输出当前温度，则节点的脚本配置如下：
                <code class="blk">
                    where(avgT > 30)<br/>
                    select(avgT as alarmT)<br/>
                    warnInfo(平均温度过高！当前温度为：${alarmT})
                </code>
            </li>
        </ul>
    </el-row>
</template>

<script type="text/ecmascript-6"></script>

<style lang="less"></style>
