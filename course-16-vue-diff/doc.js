/**
 * vue 源码分析(一) -- 深入理解 diff 算法
 * 
 * 波比小金刚
 * 
 * 难度：🌟🌟🌟🌟🌟
 * 
 * ⚠️ 为了保证一节课内容干货满满，课程内容将不一定和课表标题完全一致，特此声明一下
 * ⚠️ 有些同学基础可能差一点，有些同学基础很好，课程上如果兼顾，对双方都是不公平，体现在浪费了时间还浪费了钱，所以，后续课程都会说明难度，一星到五星（决定基本不会太简单了），课件也会补齐各种资料，如果跟不上的同学
 *    不要着急，认真看好补充资料，再回顾一下课程内容，每次都会有新的惊喜，基础好的同学就做到温故知新，夯实内功
 * ⚠️ 本节课内容，不用质疑，绝逼是 vue 核心实现中最重要的环节之一，只是我不会照着源码给大家解释一下，也不仅仅局限于 vue 的实现，比如，计算机思维的建立、 react diff、ivi diff 等
 * 
 * 毕竟，面试官现在会问：
 * Q1. react 和 vue 的 diff 算法有什么异同 ?
 * Q2. 传统 diff O(n^3)，React Diff O(n) ? 怎么来的 ? 还可以优化吗 ?
 * ...
 * 那现在开始带着问题进入今天的课程吧~
 * 
 * diff 算法并不是近年才有的，早在多年以前就已经有人在研究 diff 算法了，最早复杂度基本是 O(m^3n^3)然后优化了 30 多年，终于在 2011 年把复杂度降低到 O(n^3) 这里的 n 指的是节点总数
 * 所以 1000 个节点，要进行 1亿次操作, 还是，害，属实过高!
 * 
 * 而今天，站在巨人的肩膀上，我们将探究的 diff 算法主要指 react 横空出世之后提出的近代同层比较的 diff 算法，因为是同层嘛，复杂度就到了 O(n)，react team salute!
 * 
 * 彩蛋：了解一下，最好时间复杂度、最坏时间复杂度、平均时间复杂度、均摊时间复杂度
 * 
 * 遍历列表 长度是 n
 * 1 + 2 + 3 ... + n / (n + 1) // 1 - 没有
 * (1 + n) * n / 2(n + 1) -> n  O(n)
 * 
 * 1. 为什么需要 diff?
 * 本质上就是为了性能，性能，性能，但是这里还是需要知道为啥 dom 操作容易慢，注意，不是说 dom 操作慢...
 * 
 * 数据模型  -> virtual dom  -> 视图（DOM）
 * 
 * DSL: { type: 'div', props: {  }, ... } -> DOM 结构
 * 
 * Svelte -> 轮子哥（Rollup）
 * 
 * f(state) -> View
 * 
 * 2. why O(n^3)?
 * paper: https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf
 * 
 * 计算机世界里，比较两棵树的异同，其实可以抽象为经过一堆操作猛如虎后，将一颗树转成另一颗树的过程
 * 这里的复杂度需要衡量的是「操作数」，这里有什么可以借鉴的数学模型吗？肯定是有的噻，那就是经典的字符串编辑距离，leetcode 保留曲目，Levenshtein 算法！
 * 
 * 假设，将字符串 'hello' -> 'hallo' 需要几步？一眼望去就知道答案是一步，这个时候你脑子里的思考过程其实就是编辑距离算法的模型了，计算机思维 got!
 * 抽象一点，对字符串的操作不外乎三种，「替换」「插入」「删除」，执行这三种操作后到达目的的最小操作数，就是最短编辑距离，这里的复杂度就是我们需要考虑的
 * 
 *   a       a 跨层级比较
 *  | |     | |
 *  c b     c d
 *  [a, a] 
 *  [a, c]
 *  [a, d]
 *  ...
 *  
 *  树的最短编辑距离算法复杂度是 O(n^2)，其实就是实现的时候，拿 Levenshtein 举例，需要双层 for 循环去计算左，左上，右三个值，这里复杂度就是 O(n^2) 了
 *  然后，因为 diff 还要做一次 patch，（找到差异后还要计算最小转换方式）这个时候还要在之前遍历的基础上再遍历一次，所以累计起来就是 O(n^3) 了
 * 
 * 其实也可以看出来，这种在 react 的渲染目标下，是无意义的，跨层级比较没必要
 * 
 * 3. why O(n)?
 * 
 *   a       a
 *  | |     | |
 *  c b     c d
 * 只做同层比较：
 * [a, a] 相同，不处理
 * [c, c] 相同，不处理
 * [b, d] 不相同，替换
 * 
 * React diff 复杂度其实是 O(nm)，这里只是有一些技巧可以优化成 O(n)
 * 
 * const arr = [a, b, c] vs const newArr = [b, d, e, f]
 * [a, b]
 * [b, d]
 * [c, e]
 * [null, f]
 * 
 * for (let i = 0, len = oldNodes.length; i < len; i++) {
 *   if (oldNodes[i].type !== newNodes[i].type) {
 *     replace()
 *   }
 *   else if (oldNodes[i].children && oldNodes[i].children.length) { // 如果没有这一层，假设 type 全不相同，那么就是 O(n)，最坏复杂度 O(nm)
 *   }
 * }
 * 
 * O(n^2)
 * O(nlogn)
 * 当然，这只是 React 的实现，肯定还是有更优秀的 diff 算法的，比如 inferno 的，能到 O(mlogn)，vue3 也是借鉴了这一算法
 * 
 * 4. how O(n)?
 * 
 * react 是怎么设计将复杂度砍下来呢？其实就是在算法复杂度、虚拟 dom 渲染机制、性能中找了一个平衡，react 采用了启发式的算法，做了如下最优假设：
 * a. 如果节点类型相同，那么以该节点为根节点的 tree 结构，大概率是相同的，所以如果类型不同，可以直接「删除」原节点，「插入」新节点
 * b. 跨层级移动子 tree 结构的情况比较少见，或者可以培养用户使用习惯来规避这种情况，遇到这种情况同样是采用先「删除」再「插入」的方式，这样就避免了跨层级移动
 * c. 同一层级的子元素，可以通过 key 来缓存实例，然后根据算法采取「插入」「删除」「移动」的操作，尽量复用，减少性能开销
 * d. 完全相同的节点，其虚拟 dom 也是完全一致的
 * 
 * 基于这些假设，可以将 diff 抽象成只需要做同层比较的算法，这样复杂度就直线降低了
 * 
 * 5. 4-c 的内容，其实很有意思，如果没有指定 key 的话，react 是会给 warning 的，同时默认使用下标 index 作为 key，但是这其实是不建议的，为啥？
 * 
 * 首先，为啥要有 key，这种官方文档就有说明：https://cn.vuejs.org/v2/api/#key
 * key 的特殊 attribute 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes
 * 如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。
 * 
 * 举个例子，假设原来有 [1, 2, 3] 三个子节点渲染了，假设我们这么操作了一波，将顺序打乱变成 [3, 1, 2]，并且删除了最后一个，变成 [3, 1]
 * 那，最优的 diff 思路应该是复用 3, 1组件，移动一下位置，去掉 2 组件，这样整体是开销最小的，如果有 key 的话，这波操作水到渠成，如果没有 key 的话，那么就要多一些操作了:
 * a. 判断哪些可以复用，有 key 只需要从映射中康康 3, 1在不在，没有 key 的话，可能就执行替换了，肯定比「复用」「移动」开销大了
 * b. 删除了哪一个？新增了哪一个？有 key 的话是不是很好判断嘛，之前的映射没有的 key，比如变成 [3, 1, 4]那这个 4 很容易判断出应该是新建的，删除也同理
 *    但是没有 key 的话就麻烦一些了
 * 
 * 那既然 key 很重要，那么就有两种操作是误区了
 * 第一是使用随机数，这种导致的问题肯定就是每次 key 都不一样，那复用毛线，都是新建了
 * 第二种是使用数组下标，这个就有意思了，看看这个 demo:https://codesandbox.io/s/ancient-moon-427u7?file=/src/App.vue，看看能不能看出问题
 * 
 * 我们来分析一下：
 * [1, 2, 3] 这是原来的渲染节点，页面展示出 1, 2, 3，然后我们 splice(0, 1) 删除第一个元素后，理想情况是变成 [2, 3]
 * 但是因为使用了下标为 key，对比前后两次 keys
 * [0, 1, 2] -> [0, 1] 因为 vue 的机制，sameNode 判断一波后，误认为是 2 被删除了...害！
 * 
 * function sameVnode (a, b) {
 *  return (
 *    a.key === b.key &&  // key值
 *    a.tag === b.tag &&  // 标签名
 *    a.isComment === b.isComment &&  // 是否为注释节点
 *    // 是否都定义了data，data包含一些具体信息，例如onclick , style
 *   isDef(a.data) === isDef(b.data) &&  
 *    sameInputType(a, b) // 当标签是<input>的时候，type必须相同
 *  )
 * }
 * 
 * react 下呢？
 * 还是给大家写个 demo: https://codesandbox.io/s/fervent-nightingale-b7slr?file=/src/App.js
 * 然后大家来分析分析，为啥？
 * 
 * 提示
 * [0('a'), 1, 2, 3, 4] -> [0('b'), 1, 2, 3]
 */

// ----------------------------------------------------- talk is cheap, show me your code ----------------------------------------------------------------

/**
 * 补充资料
 * 
 * 浏览器工作原理揭秘：https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/
 * 像素的一生：https://www.bilibili.com/video/av35265997/
 * Levenshtein：https://en.wikipedia.org/wiki/Levenshtein_distance
 * inferno: https://github.com/infernojs/inferno
 * 启发式算法：https://www.zhihu.com/topic/19864220/hot
 * 最长上升子序列算法：https://en.wikipedia.org/wiki/Longest_increasing_subsequence
 */


/**
 * 虚拟 DOM
 * 
 * 1. 什么是虚拟 DOM
 *  {
 *    type: 'div',
 *    props: {
 *      children: [
 * 
 *      ]
 *    },
 *    el: xxxx
 *  }
 * 
 * 2. 怎么创建虚拟 DOM
 *  
 *  -> h 、createElement...
 * 
 * function h(type, props) { return { type, props } }
 * 
 * 3. 使用呢
 * 
 * JSX:
 * <div>
 *   <ul className='padding-20'>
 *     <li key='li-01'>this is li 01</li>
 *   </ul>
 * </div>
 * 
 * 经过一些工具转一下：
 * createElement('div', {
 *   children: [
 *     createElement('ul', { className: 'padding-20' },
 *        createElement('li', { key: 'li-01'}, 'this is li 01'))
 *   ]
 * })
 * 
 * 4. 虚拟DOM的数据结构有了，那就是渲染了 (mount/render)
 * f(vnode) -> view
 * 
 * f(vode) {
 *   document.createElement();
 *   ....
 * 
 *   parent.insert()
 *   . insertBefore
 * }
 * 
 * export const render = (vnode, parent) => {  }
 * 
 * <div id='app'></div>
 * 
 * 5. diff 相关了(patch)
 * f(oldVnodeTree, newVnodeTree, parent) -> 调度? -> view
 * 
 */