# ES 6 和

## ES 6

### 历史

2015 年 6 月发布的就是 ES6
ESNext 指下一年的版

### 常用 API 解析

#### let 和 const

```js
for (var i = 0; i <= 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, 10)
}
```

运行这个会输出什么?

会输出 4 4 4 4

原因：

1. var 定义的变量是全局的，并且可以重复定义的，所以全局只有一个变量 i
2. setTimeout，在下一轮事件循环的时候执行，而 for 循环时同步执行的

```js
for (let i = 0; i <= 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, 10)
}
```

输出： 0 1 2 3

原因：

1. let 引入了块级作用域的概念，创建 setTimeout 的时候，i 只在作用域内生效

其他解决方法：

```js
for (var i = 0; i <= 3; i++) {
  ;(function (i) {
    setTimeout(() => {
      console.log(i)
    }, 10)
  })(i)
}
```

###### 变量提升的问题

var 有变量提升，let 和 const 没有

```js
console.log(i)

var i = 1 // undefined

console.log(a)

let a = 1 // error
```

###### const 声明后不能改变（引用值可以）

```js
const arr = []

arr.push(1) // OK
```

#### 箭头函数

1. this 是在定义的时候决定的，而 function 是在使用的时候决定的
2. 简写，只有一句的时候，并没有显示的 return，会返回执行的结果

```js
const arrFn = (value) => Number(value)

// return obj
const arrFn2 = (value) => ({})
```

3. 不能被用作构造函数
   构造函数：会改变 this 指向，指到新实例
   箭头函数：this 在定义的时候定义的

#### class

```js
class Test {
  _name = ''
  constructor(name) {
    this.name = name
  }

  static getMyName() {
    return `${this._name}xxxx`
  }

  get name() {
    return this._name
  }

  set name(value) {
    console.log('检测到赋值')
    this._name = value
  }
}
```

#### 模板字符串

```js
console.log(a + 'xxx')
console.log(`${a}xxx`)
```

模板字符串会默认换行

###### 编写函数，实现模板字符串的功能

```js
const year = '2022'
const month = '10'
const day = '01'

const template = '${year}-${month}-${day}'
const context = { year, month, day }

const str = render(template)(context)

console.log(str) // 20220-10-01

// 解答
function render(template) {
  return function (context) {
    // 使用正则匹配
    // 表示匹配${}内的任何东西
    return template.replace(/\$\{(.*?)\}/g, (match, key) => context[key])
  }
}
```

#### 解构

1. 数组的解构

```js
const arr = [1, 2, 3]

const [a, b, c] = arr
console.log(a, b, c)
```

2. 对象的解构

```js
const obj = { a: 1, b: 2 }
// 同key
const { a, b } = obj
// 不同key
const { a: c, b: d } = obj
```

3. 解构的原理

针对可迭代对象 Iterator，通过遍历顺序获取对应的值进行赋值

Iterator 是什么？

是一个接口（interface），为不一样的数据解构提供统一的访问机制

任何数据只要有 Iterator（for of）

实现 Iterator

```js
function generateIterator(array) {
  let nextIndex = 0
  return {
    next: () =>
      nextIndex < array.length
        ? {
            value: array[nextIndex++],
            done: false,
          }
        : {
            value: undefined,
            done: true,
          },
  }
}

const iterator = generateIterator([2, 3, 4])
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
```

什么是可迭代对象

可迭代对象存在两种协议，可迭代协议，迭代器协议

可迭代协议：对象内部实现了 Symbol.iteratore: () => {}
迭代器协议：必须有 next 方法，next 方法返回对象的{done,value}

实现可迭代的对象

```js
const obj = {
  count: 0,
  [Symbol.iterator]: () => {
    return {
      next: () => {
        obj.count++
        if (obj.count <= 0) {
          return {
            value: obj.count,
            done: false,
          }
        } else {
          return {
            value: undefined,
            done: true,
          }
        }
      },
    }
  },
}
```

两种不同的遍历：for in 和 for of

**for in**

1. `for in` 不仅会遍历当前对象的属性，还会遍历原型链上的属性
2. 不适合遍历数组

针对第一点，所以一般使用 for in 时，要判断一下是否是本身的属性

```js
Object.prototype.aa = '33'
let obj = {
  name: 'xxx',
  age: 123,
}

for (let key in obj) {
  // console.log(key) // name age aa
  if (obj.hasOwnProperty(key)) {
    console.log(key) // name age
  }
}
```

**for of**

1. 可被 `break` 中断

#### Object

1. `Object.keys()` 输出由 `keys` 组成的数组
   实现：

```js
function getObjectKeys(obj) {
  const result = []
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result.push(key)
    }
  }
  return result
}
```

2. `Object.values` 输出 `value` 组成的数组

3. `Object.entries` 输出`[[key,value],[key1, value1]]`
   实现：

```js
function getObjectEntries(obj) {
  const result = []
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result.push([key, obj[key]])
    }
  }
  return result
}
```

4. `Object.getOwnPropertyNames()` 输出由 `key` 组成的数组

5. `Object.getOwnPropertyDescriptor()` 获取属性的描述符

6. `Object.assign` 浅拷贝

#### Promise

 