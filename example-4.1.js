
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

// 案例 4.1
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

let App
App = MyReact.render(Component)
// [render] { text: [ 'www', 'netlify', 'com' ] }
App.type('www.reactjs.org')
App = MyReact.render(Component)
// [render] { text: [ 'www', 'reactjs', 'org' ] }

