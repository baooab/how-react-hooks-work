// 案例 3

const MyReact = (function () {
  let _val, _deps // 在模块作用域内保留状态、依赖列表（useEffect 使用）

  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
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
    useState(initialValue) {
      // 每次调用时，增加 _val 值赋值判断
      _val = _val || initialValue 

      function setState(newVal) {
        _val = newVal
      }

      return [_val, setState]
    }
  }
})()

// 使用
function Counter() {
  const [count, setCount] = MyReact.useState(0) // 使用之前实现的 useState()

  MyReact.useEffect(() => {
    console.log('[effect]', count)
  }, [count])

  return {
    click() {
      setCount(count + 1)
    },
    render() {
      console.log('[render]', { count: count })
    }
  }
}

let App
App = MyReact.render(Counter)
// [effect] 0
// [render] { count: 0 }
App.click()
App = MyReact.render(Counter)
// [effect] 1
// [render] { count: 1 }
