<template>
    <el-row class="node-descriptor" v-pre>
        <p>
            <b>转换节点</b>，表示一个数据转换处理单元，对每个输入数据都会转换为一组输出数据，其计算过程无状态，
            反复对同一个输入执行其转换脚本应该得到相同的输出。
        </p>
        <p><b>基本信息：</b></p>
        <ul>
            <li><code>数据名称</code>：代表当前节点所对应的表名称；有一个固定前缀<code>Trans_</code></li>
            <li><code>数据源</code>：代表当前节点的数据来源；数据源为上一节点的输出字段</li>
            <li><code>是否存储</code>：代表是否需要存储当前节点的数据结果；
                若为否，则系统不会对该节点的数据进行存储，同时流计算测试中也不会打印出测试数据
            </li>
        </ul>
        <p><b>输出字段：</b>代表当前节点的数据输出。</p>
        <ul>
            <li><code>eventTime</code>：事件时间，取值为数据点上传到OneNET的时间；固定字段。
            </li>
        </ul>
        <p>
            <b>脚本配置：</b>通过设置脚本，可以对输入数据作出相应的转换操作，例如：四则运算等。可供使用的字段为上一节点的输出字段。
        </p>
        <ul>
            <li><code>显示调试信息</code>：进行流计算测试的时候，是否打印出当前节点的输出字段和数据结果。</li>
        </ul>
        <p>以下是脚本配置示例：</p>
        <ul>
            <li>
                示例1：假设传入字段包含temperature，如需对temperature字段进行四则运算操作并重命名，则脚本如下：
                <code class="blk">
                    select((temperature + 1 ‐ 1) * 2 / 5 as temperature1)
                </code>
            </li>
        </ul>
    </el-row>
</template>

<script type="text/ecmascript-6"></script>

<style lang="less"></style>
