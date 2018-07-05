<template>
    <el-row class="node-descriptor" v-pre>
        <p>
            <b>统计节点</b>，是一个实时流计算的过程，其目的是对输入数据流进行流式统计，其内部有状态，可能多条输入数据才会有一个输出记录。
            统计节点支持基于窗口的统计操作，可以通过对脚本的配置，实现每隔<code>interval</code>对应的时间，
            对过去<code>window</code>对应的时间内的数据进行统计。
        </p>
        <p><b>基本信息：</b></p>
        <ul>
            <li><code>统计名称</code>：代表当前节点所对应的表名称；有一个固定前缀<code>Stats_</code></li>
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
                由于统计节点的特殊性，多个数据点的eventTime不同，因此统计节点之后的eventTime代表统计窗口的结束时间。
            </li>
            <li>
                <code>windowStartTime</code>：统计窗口开始时间；固定字段。
            </li>
            <li>
                <code>windowStopTime</code>：统计窗口结束时间；固定字段。
            </li>
        </ul>
        <p>
            <b>脚本配置：</b>配置实时统计的规则。可供使用的字段为上一节点的输出字段。
        </p>
        <ul>
            <li><code>显示调试信息</code>：进行流计算测试的时候，是否打印出当前节点的输出字段和数据结果。</li>
            <li>
                <code>WHERE</code>：
                非必填，表示统计的条件，不填表示对收到的所有数据进行统计；
                如需对满足传入字段temperature的值大于0且小于50的条件的数据进行统计，则脚本为：
                <code class="blk">
                    where(temperature > 0 && temperature < 50)
                </code>
            </li>
            <li>
                <code>窗口长度</code>：
                必填，表示统计的窗口长度，输入对应时分秒；统计的窗口长度不能超过6小时，如需更长时间的统计，请使用BaaS系统的离线统计功能。
            </li>
            <li>
                <code>间隔周期</code>：
                非必填，表示统计的间隔时间，不填则默认与窗口长度相等；窗口长度及间隔时间必须大于0秒，且间隔时间不能超过窗口长度。
            </li>
            <li>
                <code>GROUPBY</code>：
                非必填，表示进行统计的维度，可填写多个维度，多个维度之间需以 英文逗号<code>,</code>进行分隔；
                例如以<code>deviceId</code>作为维度进行统计，则脚本为：
                <code class="blk">
                    groupBy(deviceId)
                </code>
            </li>
            <li>
                <code>SELECT</code>：
                必填，同sql的select语句，表示将需要向下传递的字段查询提取为一张表，支持统计函数。
                如需统计传入字段<code>temperature</code>的平均值，并将计算结果命名为"avg_temperature",则脚本为
                <code class="blk">
                    select(temperature.avg as avg_temperature)
                </code>
            </li>
        </ul>
    </el-row>
</template>

<script type="text/ecmascript-6"></script>

<style lang="less"></style>
