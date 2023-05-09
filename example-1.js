import { useState } from './example-0.js'

// 案例 1

function Counter() {
  const [count, setCount] = useState(0) // 使用之前实现的 useState()

  return {
    click() {
      setCount(count() + 1)
    },
    render() {
      console.log('[render]', { count: count() })
    }
  }
}

const c = Counter()
c.render() // [render] { count: 0 }
c.click()
c.render() // [render] { count: 1 }
