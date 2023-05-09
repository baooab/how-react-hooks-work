// 案例 0

export function useState(initialValue) {
  var _val = initialValue // `_val` 是 useState 函数内的一个本地变量

  function state() {
    // state 则是一个内部函数，一个闭包
    return _val // state() 用到了在外部作用域（父函数）中声明的变量 `_val`
  }

  function setState(newVal) {
    // 一样
    _val = newVal // 设置 `_val` 的值，`_val` 不对外暴露
  }

  return [state, setState] // 暴露 getter、setter 函数供外部调用
}

var [foo, setFoo] = useState(0) // 使用数组解构
console.log(foo()) // 0 - 得到刚传入的 initialValue 的值
setFoo(1) // 设置 useState 作用域内的 `_val`
console.log(foo()) // 1 - 得到新传入的值
