import { mount } from "./mount.js"
import { patch } from "./patch.js"


// [a, b, c, d]  
// [d, a, b, c]
// 最快的 d 移动到第一个，a b c 不要动 （最长上升子序列算法）
// 不动的 d，d a ... d a b  ... d a b c

export const odiff = (prevChildren, nextChildren, parent) => {
  // 前指针
  let j = 0

  // 后指针
  let prevEnd = prevChildren.length - 1
  let nextEnd = nextChildren.length - 1

  let prevNode = prevChildren[j]
  let nextNode = nextChildren[j]

  // [a, b, c, d]   [a, b, c, d, e]
  //  j        👆    j           👆
  outer: {
    while(prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent)
      j++
      if (j > prevEnd || j > nextEnd) break outer
      prevNode = prevChildren[j]
      nextNode = nextChildren[j]
    }

    prevNode = prevChildren[prevEnd]
    nextNode = nextChildren[nextEnd]

    while (prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent)
      prevEnd--
      nextEnd--
      if (j > prevEnd || j > nextEnd) break outer
      prevNode = prevChildren[prevEnd]
      nextNode = nextChildren[nextEnd]
    }
  }

  // [a, b, c, h, d]   [a, b, c, f, m, k, h, d]
  //        👆 j                 j     👆
  if (j > prevEnd && j <= nextEnd) {
    let nextPos = nextEnd + 1
    let refNode = nextPos >= nextChildren.length
      ? null
      : nextChildren[nextPos].el
    while (j <= nextEnd) {
      mount(nextChildren[j++], parent, refNode)
    }
    return
  }

  // [a, b, c, f, m, k, h, d]  [a, b, c, h, d]   
  //           j     👆               👆  j
  else if (j > nextEnd) {
    while (j <= prevEnd) {
      parent.removeChild(prevChildren[j++].el)
    }
    return
  }

  // [a, b, c, d]  [c, a, d, b]
  //  j        👆   j        👆
  let nextStart = j,
    prevStart = j,
    nextLeft = nextEnd - j + 1,
    nextIndexMap = {},
    source = new Array(nextLeft).fill(-1),
    patched = 0,
    lastIndex = 0,
    move = false

  // { 'c': 0, 'a': 1, 'd': 2, 'b': 3 }
  for (let i = nextStart; i <= nextEnd; i++) {
    let key = nextChildren[i].key || i
    nextIndexMap[key] = i
  }

  for (let i = prevStart; i <= prevEnd; i++) {
    let prevChild = prevChildren[i],
      prevKey = prevChild.key || i,
      nextIndex = nextIndexMap[prevKey]

    // [a, b, f, m, c]  [c, a, d, b]
    //  a                                nextLeft = 4; patched = 1; nextIndex = 1; nextStart = 0; source = [-1, 0, -1, -1]; lastIndex = 1
    //     b                             nextLeft = 4; patched = 2; nextIndex = 3; nextStart = 0; source = [-1, 0, -1, 1]; lastIndex = 3
    //        f                          nextLeft = 4; patched = 2; 
    //           m                       nextLeft = 4; patched = 2; 
    //              c                    nextLeft = 4; patched = 3; nextIndex = 0; nextStart = 0; source = [4, 0, -1, 1]; lastIndex = 3; move = true
    if (patched >= nextLeft || nextIndex === undefined) {
      parent.removeChild(prevChild.el)
      continue
    }
    patched++
    let nextChild = nextChildren[nextIndex]
    patch(prevChild, nextChild, parent)

    source[nextIndex - nextStart] = i

    if (nextIndex < lastIndex) {
      move = true
    } else {
      lastIndex = nextIndex
    }
  }

  if (move) {
    const seq = lis(source); // seq = [1, 3]
    let j = seq.length - 1;
    for (let i = nextLeft - 1; i >= 0; i--) {
      let pos = nextStart + i,
        nextPos = pos + 1,
        nextChild = nextChildren[pos],
        refNode = nextPos >= nextLeft ? null : nextChildren[nextPos].el
      // [4, 0, -1, 1]
      if (source[i] === -1) {
        mount(nextChild, parent, refNode)
      } else if (i !== seq[j]) {
        parent.insertBefore(nextChild.el, refNode)
      } else {
        j--
      }
    }
  } else {
    // no move
    for (let i = nextLeft - 1; i >= 0; i--) {
      if (source[i] === -1) {
        let pos = nextStart + i,
          nextPos = pos + 1,
          nextChild = nextChildren[pos],
          refNode = nextPos >= nextLeft ? null : nextChildren[nextPos].el
      
        mount(nextChild, parent, refNode)
      }
    }
  }
}

// 最长上升子序列算法： 就是在一个序列中，求长度最长且顺序是升序的子序列
// 1, 5, 2, 4, 6, 0, 7 -> 1, 2, 4, 6, 7

// 0 8 4 12 2 10 6 4 1 9 5 13
// 0
// 0 8
// 0 8 4 ❌
// 0 8 12 
// 0 8 12 2 ❌
// ...
// 0 8 12 13 | 0 4 9 13 | ... 

function lis(arr) {
  let len = arr.length,
    result = [],
    dp = new Array(len).fill(1);

  for (let i = 0; i < len; i++) {
    result.push([i])
  }

  for (let i = len - 1; i >= 0; i--) {
    let cur = arr[i], nextIndex = undefined
    if (cur === -1) continue

    for (let j = i + 1; j < len; j++) {
      let next = arr[j]
      if (cur < next) {
        let max = dp[j] + 1
        if (max > dp[i]) {
          nextIndex = j
          dp[i] = max
        }
      }
    }
    if (nextIndex !== undefined) result[i] = [...result[i], ...result[nextIndex]]
  }
  let index = dp.reduce((prev, cur, i, arr) => cur > arr[prev] ? i : prev, dp.length - 1)
  return result[index]
}
