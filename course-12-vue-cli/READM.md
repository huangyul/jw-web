# vue-cli

依赖的库

1. commander：命令行中的参数获取
2. inquirer：命令行的表单
3. chalk：命令行中的可变颜色效果
4. clui：命令行中的 loading 效果
5. child_proess：node 原生模块，提供一些方法让我们能够执行新的命令

## 基本使用

```bash
npm install -g @vue/cli

vue create app-name
```

## 实现一个 cli

- 必须要创建一个可执行的命令
- 命令必须提供一些可执行的配置
- 可交互形式的表单
- 执行完命令后可以生成一个定制化的目录

#### 创建文件目录

```bash
mkdir cli
cd cli
npm init
touch
```

### 使用命令去执行脚本

将 node 脚本变成可执行的脚本

1. 编写 index.js

```js
// 当文件以脚本的形式执行时，使用什么脚本执行，现在就使用node来执行
#!/usr/bin/env node

console.log('hello cli')
```

> ! 第一句的作用是当该文件以脚本文件执行时，使用 node 进行解析

2. 在 package.json

```json
"bin": {
  "mycli": "./index.js"  // 执行的脚本,mycli是脚本的名字
}
```

3. 创建软链接

```bash
# 创建软链接，当在node环境中执行mycli，就会执行这个项目里面的mycli命令，从而执行index.js
npm link
```

> 解除软链接：npm unlink commond

现在在命令行里执行`mycli`，就会执行脚本，从而输出`hello cli`

### 格式化用户的输入

用户在命令行输入的参数，都可以使用 `process.argv` 获取，获取的结果以数组的方式返回

#### 安装所需的依赖

`yarn add commander inquirer`

#### 简单使用

```js
// <>是必填项，[]是可填项
// 让用户填写一些表单
program
  .arguments('<dir>') // 用户需要输入什么
  .description('this is a directory') // 描述
  .action((dir) => {
    // 拿到后执行什么
    console.log('--dir', dir)
  })

// 格式化参数
program.parse(process.argv)
```
