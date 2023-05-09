// 案例 2

const MyReact = (function () {
  let _val // 在模块作用域内保留状态

  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
    useState(initialValue) {
      // 每次调用时，增加 _val 值赋值判断
      const state = _val || initialValue 

      function setState(newVal) {
        _val = newVal
      }

      return [state, setState]
    }
  }
})()

// [续] 案例 2
function Counter() {
  const [count, setCount] = MyReact.useState(0) // 使用之前实现的 useState()

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
App = MyReact.render(Counter) // [render] { count: 0 }
App.click()
App = MyReact.render(Counter) // [render] { count: 1 }
