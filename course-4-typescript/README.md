# Typescript

## 使用 ts 的好处

1. ts 是 js 的超集，ts 包含 js 的所有功能，并拓展了静态类型和基于类的面向对象编程，功能比 js 多（类的 protect, private）；
2. 开发的过程中，ts 就能给出编译的错误，js 的错误需要在运行的时候才能暴露出来；
3. 是强类型的语言，可以明确知道各种数据的类型，可读性强；
4. ts 中有很多方便的特性，比如可选链

## Type 和 Interface 的异同

重点：interface 重点用来描述数据结构。type 重点是用来描述类型

```typescript
// 一般的使用情况
type a = 'a' | 'b'
interface b {
  a: string
  b: number
}
```

### 什么叫泛型，泛型的具体使用

泛型是指在定义函数，interface，class 的时候，不去定义类型，在使用的时候才确定类型

```ts
interface Test<T> {
  name: T
}

type TestA = Test<string>

const t: TestA = {
  name: 'sdf',
}
```

### 装饰器

1. 计算时间的装饰器

```ts
// decorator.js
export function measure(target: any, name: any, descriptor: any) {
  const oldValue = descriptor.value
  descriptor.value = async function () {
    const start = Date.now()
    const res = await oldValue.apply(this, arguments)
    console.log(`${name}执行耗时 ${Date.now() - start}`)
    return res
  }
  return descriptor
}
```

```vue
<script>
  import { measure } from ".../xx";
  default export {
    @measure
    public async created() {
      await this.getData()
    }
    private getData() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 1000);
      })
    }
  }
</script>
```

2. 缓存装饰器

```ts
const cacheMap = new Map()
export function EnableCache(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  const val = descriptor.value
  descriptor.value = async function (...args: any) {
    const cacheKey = name + JSON.stringify(args)
    if (!cacheMap.has(cacheKey)) {
      const cacheValue = Promise.resolve(val.apply(this, args)).catch(() => {
        cacheMap.set(cacheKey, null)
      })
      cacheMap.set(cacheKey, cacheValue)
    }
  }
  return descriptor
}
```
