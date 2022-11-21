const year = '2022'
const month = '10'
const day = '01'

const template = '${year}-${month}-${day}'
const context = { year, month, day }

const str = render(template)(context) // 两个小括号的函数是高阶函数

console.log(str) // 20220-10-01

function render(template) {
  return function (context) {
    // 使用正则匹配
    // 表示匹配${}内的任何东西
    return template.replace(/\$\{(.*?)\}/g, (match, key) => context[key])
  }
}
