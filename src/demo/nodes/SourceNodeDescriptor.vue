<template>
    <el-row class="node-descriptor" v-pre>
        <p>
            <b>源节点</b>，又称开始节点，是数据处理的起始节点；
            其代表对OneNET产品的某条数据流的处理入口，
            由于同一OneNET产品可以有多条数据流，因此可以有多个源节点，
            一个节点代表一个OneNET数据流。用户通过对源节点的脚本配置，可以对从OneNET接收到的json格式数据进行提取、拆分、重命名操作。
        </p>
        <p><b>基本信息：</b>主要包括数据流名称。</p>
        <ul>
            <li><code>数据流名称</code>：对应要从OneNET端抽取的数据流</li>
        </ul>
        <p><b>输出字段：</b>代表当前节点的数据输出。</p>
        <ul>
            <li><code>eventTime</code>：事件时间，取值为数据点上传到OneNET的时间；固定字段。</li>
        </ul>
        <p>
            <b>脚本配置：</b>
            通过设置脚本，可以对从OneNET端接收到的数据进行提取、拆分和重命名。可供使用的字段包括：
            <code>deviceId</code>、<code>at</code>、<code>OneNETData</code>、<code>stream</code>。
        </p>
        <ul>
            <li>
                <code>OneNETData</code>：数据内容
            </li>
            <li>
                <code>deviceId</code>：设备ID
            </li>
            <li>
                <code>at</code>：时间戳
            </li>
            <li>
                <code>stream</code>：数据流名称
            </li>
        </ul>
        <p>以下是两个脚本配置示例：</p>
        <ul>
            <li>
                示例1：如需将从OneNET处接收到的数据重命名为"temperature"，并输出temperature和deviceId则脚本如下：
                <code class="blk">
                    select(OneNETData as temperature,deviceId)
                </code>
            </li>
            <li>
                示例2：假设OneNET处接收到的数据为GPS类型的数据，
                数据字段为{"lon":value,"lat":value}形式的多个key-value组成的混合型数据，
                需要提取出lon以及lat，则脚本如下：
                <code class="blk">
                    select(OneNETData.lon as lon, OneNETData.lat as lat)
                </code>
            </li>
        </ul>
    </el-row>
</template>

<script type="text/ecmascript-6"></script>

<style lang="less"></style>
