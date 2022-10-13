# 面向对象编程 && 原型及原型链

## 面向对象编程

###### 什么是面向对象编程

面向对象编程是一个思想

面向过程：分析出解决问题需要的步骤，编写对应的函数来实现每个步骤，依次来调用函数；
面向对象：关注的重点是主谓，把构成问题的事物拆解成各个对象，目的不是为了实现某个具体的步骤，是为了描述这个事物在当前问题中的各种行为

面向对象的特点：

1. 封装：让使用对象的人不考虑内部的实现，只需要考虑功能的使用，把内部的代码保护起来，只留出一下 api 供使用方使用
2. 继承：（js 不常见，ts 比较常见），为了代码通用，从父类上继承出一些方法和属性，子类也有自己的一些属性
3. 多态：是不同对象作用于同一操作产生的不同结果 多态的思想实际上是把 “想做什么” 和 “谁去做” 分开

比如下棋的过程：

**面向过程思想**

开局 -> 白方下棋 -> 棋盘展示 -> 检查胜负 -> 黑方下棋 -> 棋盘展示 -> 检查胜负 -> ......循环

**面向对象思想**

棋盘对象，棋手对象

棋盘.开局 -> 棋手.下棋 -> 棋盘.重新展示 ......循环

### 什么时候适合使用面向对象的思想

在比较复杂的问题面前，或者说参与方较多的时候，可以很好的简化问题，能够更好的拓展和维护。

## Js 中的面向对象

### 对象包含什么

属性和方法

### 内置的对象

Object Array Date Function RegExp

### 创建对象

**普通的方法**

```js
const player = new Player()
Player.color = 'white'
Player.say = function () {
  console.log()
}
```

**工厂模式**

```js
function createOject(name, age) {
  const Player = new Object()
  Player.name = name
  Player.age = age
}
createObject('name', 23)
```

缺点：无法正确识别出对象的类型

**构造函数**

```js
function Person(name, age) {
  this.name = name
  this.age = age
}
const p = new Person('huang', 12)
```

缺点：this 挂的属性或者对象，都是指向当前对象，所以在实例化的时候，通过 this 添加的属性和方法，就会在内存中复制一份，造成内存浪费
优点：改变某个对象的属性和方法不会影响到其他对象；

**原型**

```js
function Person(name) {
  this.name = color
}
Person.propertype.say = function () {
  console.log(this.name)
}
```

优点：方法只会创建一次，方法不是自身的，是在原型上的

**静态属性**

绑定在构造函数上的，通过构造函数访问

```js
function Person(name) {
  this.name = name
  Person.say = function () {
    console.log(123)
  }
}
```

## 原型及原型链

### 在原型上添加属性和方法有什么好处

每个属性和方法都是共用的

### 如何找到原型对象

```js
function Person(name) {
  this.name = name
}
Person.prototype.say = function () {}
const p1 = new Person('x')

console.log(p1.__proto__) // { say: [Function (anonymous)] }
console.log(Object.getPrototypeOf(p1)) // { say: [Function (anonymous)] }
console.log(Person.prototype) // { say: [Function (anonymous)] }
console.log(Person.__proto__) // {}
```

### new 关键字的作用是什么

1. 在内存中创建一个新的对象
2. 这个新的对象内部的`[[Prototype]]`特性被赋值为构造函数的`prototype`属性
3. 构造函数内部的`this`被赋值为这个新对象（即 this 指向新对象）
4. 执行构造函数内部的代码（为新对象添加属性）
5. 如果构造函数返回非空对象，则返回该对象；否则返回刚创建的新对象

手写 new

```js
function Person(name) {
  this.name = name
}

function _new() {
  const obj = new Object()

  let FunctionConstructor = [].shift.call(arguments) // 取出第一个参数，即构造函数
  obj.__proto__ = FunctionConstructor.prototype

  let resultObj = FunctionConstructor.apply(obj, arguments)

  return typeof resultObj === 'object' ? resultObj : obj
}

const p1 = _new(Person, 'x')
```

### 原型链是什么
1.14