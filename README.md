# 『深入探究：React Hooks 工作原理』文章的代码仓库

## 案例 0 - 基础版本 `useState()`

我们实现了基本版本的 `useState()`，不过 `currentState` 是个函数。

```js
// example-0.js
var [foo, setFoo] = useState(0)
foo() // 0
setFoo(1)
foo() // 1
```



## 案例 0.1 - 尝试与真实 `useState()` API 对齐（有问题！）

我们想办法让 currentState 不是以函数的形式调用获取当前状态。

```js
// example-0.1.js
function useState(initialValue) {
  var _val = initialValue
  function setState(newVal) {
    _val = newVal
  }
  return [_val, setState]
}
```

这样肯定不行，外部获得只是值得一个快照版本。

## 案例 2 - 使用组件闭包实现与真实 useState() API 对齐

使用组件闭包保留状态。

```js
// example-2.js
const MyReact = (function () {
  let _val

  return {
    // ...
    useState(initialValue) {
      _val = _val || initialValue

      function setState(newVal) {
        _val = newVal
      }

      return [_val, setState]
    }
  }
})()
```

## 案例 3 - 增加 `useEffect` 实现

复刻 `useEffect`。

```js
// example-3.js
const MyReact = (function () {
  let _val, _deps 

  return {
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const hasChangedDeps = _deps 
        ? /* 非首次调用 */ depArray.some((dep, i) => !Object.is(dep, _deps[i]))
        : /* 首次调用 */true

      if (hasNoDeps || hasChangedDeps) {
        callback()
        _deps = depArray
      }
    },
  }
})()
```

## 案例 4 - 支持组件中多次使用 `useState()` 和 `useEffect()`

上述实现的版本有个问题，就是一个组件只能写一个 `useState()` 和 `useEffect()`。

为了能够实现写多个 `useState()` 和 `useEffect()`，我们需要将 `_val`、`_deps` 替换成 `hooks` 和 `currentHookIndex`

`currentState` 和 `useEffect` 的依赖数组都从 `hooks[currentHookIndex]` 获取。

```js
// example-4.js
const myReact = (functinon () {
  let hooks = []
  let currentHookIndex = 0

  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      currentHookIndex = 0 // 重要！重置索引，为下一次渲染做准备
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const deps = hooks[currentHookIndex]
      const hasChanedDeps = deps
        ? /* 非首次调用 */ depArray.some((dep, i) => Object.is(dep, deps[i]))
        : /* 首次调用 */true

      if (hasNoDeps || hasChanedDeps) {
        callback()
        // 存储变动后的依赖数组
        hooks[currentHookIndex] = depArray
      }

      currentHookIndex++;
    },
    useState(initialValue) {
      hooks[currentHookIndex] = hooks[currentHookIndex] || initialValue 

      // 重要！currentHookIndex 会自增，为了保留当前返回的 setState 中用到的 currentHookIndex 变量，要额外引入一个变量
      const setStateHookIndex = currentHookIndex

      fucntion setState(newVal) {
        hooks[setStateHookIndex] = newVal
      }

      return [hooks[currentHookIndex++], setState]
    }
  }
})()
```


## 案例 4.1 - 声明自定义 Hook

```js
// example-4.1.js
function Component() {
  const [text, setText] = useSplitURL('www.netlify.com')

  return {
    type(txt) {
      setText(txt)
    },
    render() {
      console.log('[render]', { text })
    }
  }
}

function useSplitURL(str) {
  const [text, setText] = MyReact.useState(str)
  const masked = text.split('.')
  return [masked, setText]
}
```
