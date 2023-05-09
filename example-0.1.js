// 案例 0.1 - 案例 0 重写，注意有BUG！

export function useState(initialValue) {
  var _val = initialValue // `_val` 是 useState 函数内的一个本地变量

  // 移除 state() 函数

  function setState(newVal) {
    // 一样
    _val = newVal // 设置 `_val` 的值
  }

  return [_val, setState] // 直接暴露 `_val`
}

var [foo, setFoo] = useState(0) // 使用数组解构
console.log(foo()) // 0 - 得到刚传入的 initialValue 的值
setFoo(1) // 设置 useState 作用域内的 `_val`
console.log(foo()) // 0 - 天哪，有 BUG！！
