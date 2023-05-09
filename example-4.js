// 案例 4

const MyReact = (function () {
  let hooks = [], // Hook 数组
    currentHookIndex = 0 // 记录当前要访问的 Hook 索引

  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      currentHookIndex = 0 // 重置索引，为下一次渲染做准备
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const deps = hooks[currentHookIndex]
      const hasChangedDeps = deps 
        ? /* 非首次调用 */ depArray.some((dep, i) => !Object.is(dep, deps[i]))
        : /* 首次调用 */true

      if (hasNoDeps || hasChangedDeps) {
        callback()
        hooks[currentHookIndex] = depArray
      }
      currentHookIndex++
    },
    useState(initialValue) {
      hooks[currentHookIndex] = hooks[currentHookIndex] || initialValue 

      const setStateHookIndex= currentHookIndex // setState 闭包中使用！

      function setState(newVal) {
        hooks[setStateHookIndex] = newVal
      }

      return [hooks[currentHookIndex++], setState]
    }
  }
})()

// [续] 案例 4
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  const [text, setText] = MyReact.useState('foo') // 第二个状态 Hook
  MyReact.useEffect(() => {
    console.log('[effect]', count)
  }, [count, text])

  return {
    click() {
      setCount(count + 1)
    },
    render() {
      console.log('[render]', { count, text })
    },
    noop() {
      setCount(count)
    },
    type(txt) {
      setText(txt)
    }
  }
}

let App
App = MyReact.render(Counter)
// [effect] 0
// [render] { count: 0, text: 'foo' }
App.click()
App = MyReact.render(Counter)
// [effect] 1
// [render] { count: 1, text: 'foo' }
App.type('bar')
App = MyReact.render(Counter)
// [effect] 1
// [render] { count: 1, text: 'bar' }
App.noop()
App = MyReact.render(Counter)
// // no effect run
// [render] { count: 1, text: 'bar' }
App.click()
App = MyReact.render(Counter)
// [effect] 2
// [render] { count: 2, text: 'bar' }
