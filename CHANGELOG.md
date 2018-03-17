<a name="0.0.4"></a>
## 0.0.4 (2018-03-17)


### Features

* shift+单击节点：可以选中该路径上的全部节点 ([7e00020](https://github.com/hong-boy/node-chart-flow/commit/7e00020))
* 完成缩放（下一步：完善事件交互） ([df0ab8d](https://github.com/hong-boy/node-chart-flow/commit/df0ab8d))
* 完成节点复制功能（下一步：完成节点导入|导出） ([fbdd9bb](https://github.com/hong-boy/node-chart-flow/commit/fbdd9bb))
* 完成节点属性渲染 ([25c945d](https://github.com/hong-boy/node-chart-flow/commit/25c945d))
* 完成设置菜单（下一步：完成helper和弹出框） ([d1e2bd7](https://github.com/hong-boy/node-chart-flow/commit/d1e2bd7))
* 实现节点或连线删除交互（下一步：实现整体拖动、缩放） ([7f11cd0](https://github.com/hong-boy/node-chart-flow/commit/7f11cd0))
* 测试 ([9748e15](https://github.com/hong-boy/node-chart-flow/commit/9748e15))
* 监听键盘事件 ([1e9a35e](https://github.com/hong-boy/node-chart-flow/commit/1e9a35e))
* 需要完成节点属性渲染 ([08e6888](https://github.com/hong-boy/node-chart-flow/commit/08e6888))


### BREAKING CHANGES

* isolate scope bindings definition has changed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.



<a name="0.0.3"></a>
## 0.0.3 (2018-03-07)


### Features

* 测试 ([9748e15](https://github.com/hong-boy/node-chart-flow/commit/9748e15))


### BREAKING CHANGES

* isolate scope bindings definition has changed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.



<a name="0.0.2"></a>
## 0.0.2 (2018-03-07)


### Features

* 测试 ([9748e15](https://github.com/hong-boy/node-chart-flow/commit/9748e15))


### BREAKING CHANGES

* isolate scope bindings definition has changed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.



