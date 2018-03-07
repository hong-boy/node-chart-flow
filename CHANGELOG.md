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



