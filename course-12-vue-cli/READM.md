# vue-cli

依赖的库

1. commander：命令行中的参数获取
2. inquirer：命令行的表单
3. chalk：命令行中的可变颜色效果
4. clui：命令行中的loading效果
5. child_proess：node原生模块，提供一些方法让我们能够执行新的命令

## 基本使用

```bash
npm install -g @vue/cli

vue create app-name
```

## 实现一个cli

#### 创建文件目录

```bash
mkdir cli
cd cli
npm init
touch
```

#### 使用命令去执行脚本

1. 编写index.js

```js
#!/usr/bin/env node

console.log('hello cli')
```

>! 第一句的作用是当该文件以脚本文件执行时，使用node进行解析

2. 在package.json