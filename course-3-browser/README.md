# 浏览器详解

## 常见浏览器 JS 对象 API 及用法

### 什么是浏览器对象模型

DOM: Document
BOM: Browser Object Model(浏览器对象模型)，浏览器模型提供了独立于内容的、可以与浏览器窗口进行滑动的对象结构，就是**浏览器提供的 API**

其主要对象有：

1. window 对象--BOM 的核心，是 js 访问浏览器的接口，也是 ES 规定的 Global 对象（兜底对象）
2. location 对象：提供当前窗口中的加载的文档有关的信息和一些导航功能，即使 window 是对象属性，也是 docuent 对象属性
   2.1 location.href：返回，可以返回上一个页面（是 location 的一个属性）  
   2.1 location.replace：无法返回上一个页面（是 location 的一个方法）  
   2.3 location.reload：重新载入页面
3. navigator 对象：用来获取浏览器的系统信息
   3.1 window.navigator.onLine：判断网络是否正常
4. screen 对象：用来表示浏览器窗口外部的显示器的信息
5. history 对象：保存用户上网的历史信息

### window 对象

1. alert()
2. confirm()
3. prompt()
4. open()
5. onerror()
6. setTimeout()
7. setInterval()
   app 里嵌入 h5 的时候，setTnterval 做到倒计时或者计时，会直接执行 10 次

使用 setTimeout 实现 setInterval

````js
function selfInterval(fn, delay, times) {
  if(!times) {
    return
  }
  setTimeout(() => {
    fn()
    selfInterval(fn, delay, --times)
  },delay)
}
```
- 窗口位置

1. screenLeft
2. screenTop
3. screenX
4. screenY
5. moveBy(x, y)
6. moveTo(x, y)

```js
// 获取视窗的高度
window.innerWidth || document.body.innerWidth
window.innerHeight || document.body.innerHeight
````

## 浏览器事件模型详解

三个阶段：捕获阶段、目标阶段、冒泡阶段

### 第三个参数

```js
dom.addEventListener('click', () => {}, false) // false是默认值
```

false: 监听冒泡阶段
true：监听捕获阶段

```html
<div id="parent">
  <div id="child">
    <div id="son"></div>
  </div>
</div>

<script>
  const parent = document.getElementById('parent')
  const child = document.getElementById('child')
  const son = document.getElementById('son')

  window.addEventListener(
    'click',
    (e) => {
      console.log(e.target.nodeName) // e.target 当前点击的元素
      console.log(e.currentTarget.nodeName) // e.currentTarget 绑定监听事件的元素
    },
    true
  )
  parent.addEventListener(
    'click',
    (e) => {
      console.log(e.target.nodeName)
    },
    true
  )
  child.addEventListener(
    'click',
    (e) => {
      console.log(e.target.nodeName)
    },
    true
  )
  son.addEventListener(
    'click',
    (e) => {
      console.log(e.target.nodeName)
    },
    true
  )
</script>
```

**e.target 当前点击的元素**  
**e.currentTarget 绑定监听事件的元素**

###### 经典面试题

题目：有一个页面，里面有 1000 个按钮或者其他元素，都有自己的 click 事件;现在有一个新需求，判断如果用户的 banned 为 true，则所以元素都不可点击。

解决思路：

1. 加一个遮蔽层，透明，却 z-index：1000；
2. 在最外层元素，在事件捕获阶段，阻止冒泡，做事件流拦截（最好的方案）

```js
parent.addEventListener(
  'click',
  (e) => {
    if (banned) {
      e.stopPropagation()
      return
    }
  },
  true
)
```

### 阻止事件传播

`stopPropagation`：这个方法的作用其实是阻止事件的传播

### 阻止默认行为

`preventDefault`：阻止元素的默认行为

例如：

1. a 标签点击跳转
2. 表单的提交按钮

兼容性的问题，所以写一个通用的方式：

```js
class domEvent {
  constructor(element) {
    this.element = element
  }

  addEvent(type, handler) {
    if (this.element.addEventListener) {
      this.element.addEventListener(type, handler, false)
    } else if (this.element.attachEvent) {
      this.element.attachEvent('on' + type, function () {
        handler.call(element)
      })
    } else {
      this.element['on' + type] = handler
    }
  }

  removeEvent(type, handler) {
    if (this.element.removeEventListener) {
      this.element.removeEventListener(type, handler)
    } else if (this.element.detachEvent) {
      this.element.detachEvent('on' + type, handler)
    } else {
      this.element['on' + type] = null
    }
  }
}

function stopPropagation(ev) {
  if (ev.stopPropagation) {
    ev.stopPropagation()
  } else {
    ev.cancelBubble = true // IE ie不支持事件捕获
  }
}

function preventDefault(ev) {
  if (ev.preventDefault) {
    ev.preventDefault()
  } else {
    ev.returnValue = false // IE
  }
}
```

### 事件委托

```html
<div>
  <ul id="ul">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
  </ul>
</div>
<script>
  // 点击li，获取每个li的内容和索引
  const ul = document.querySelector('ul')
  ul.addEventListener('click', (e) => {
    const target = e.target
    if (target.tagName.toLowerCase() == 'li') {
      const liList = this.querySelectorAll('li') // 类数组
      // 方式1
      const arr = Array.from(liList)
      arr.indexOf(target)
      // 方式2
      const index = Array.prototype.indexOf(liList, target)

      console.log(`内容为${target.innerHTML}，索引为${index}`)
    }
  })
</script>
```

## 浏览器请求

### ajax 及 fetch API 详解

get：获取数据
post：录入表单
delete：删除
put：更新

常见的请求方式：

1. XMLHTTPRequest
2. fetch（见的不多）

###### XMLHTTPRequest

```js
const xhr = new XMLHttpRequest()

xhr.open('GET', 'http://xxx/xxx')

xhr.onreadystatechange = function () {
  // readyState 为4请求才算成功
  if (xhr.readyState != 4) {
    return
  }

  if (xhr.status == 200) {
    console.log(xhr.responseText)
  } else {
    console.error(xhr.status, xhr.statusText)
  }
}

xhr.timeout = 3000

// 获取上传进度
xhr.upload.onprogress = function (p) {
  console.log(Math.round((p.loaded / p.total) * 100) + '%')
}

xhr.send()
```

###### fetch

```js
fetch('http://xxx/xxx', {
  method: 'GET',
})
  .then((res) => {
    res.json()
  })
  .then((json) => console.log(json))
  .catch((err) => {
    console.log(err)
  })
```

注意点：

1. 默认不带 cookie

```js
fetch('http://xxx/xxx', {
  method: 'GET',
  credentials: 'same-origin',
})
```

2. 错误不会 reject，http 错误，比如 404，不会导致 fetch 返回的 promise 标记为 reject；想要精确的判断，判断 response.ok

```js
fetch('https://xxx/xxx', {
  method: 'GET',
}).then(res => {
  if(response.ok) {
    // 请求成功 200
    ...
  }else {
    throw new error('fetch error')
  }
})
.then(json => console.log(json))
.catch(err => console.log(err))
```

3. 不支持设置超时

```js
// 自己封装
function fetchTimeout(url, config, timeout = 9999) {
  return new Promise((resolve, reject) => {
    fetch(url, config).then(resolve).catch(reject)
    setTimeout(reject, timeout)
  })
}
```

4. 中止 fetch

```js
const controller = new AbortController()

fetch('https://xxx/xxx', {
  method: 'GET',
  signal: controller.signal, // 接受一个信号，可以使请求中止
})

controller.abort() // 中止请求
```
