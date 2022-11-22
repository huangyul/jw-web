// Types拥有每一个单一类型节点的定义，包含哪些属性，什么是合法值
module.exports = function ({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path, state) {
        // 找到AST节点
        const node = path.node

        if (
          t.isVariableDeclaration(node, {
            kind: 'const',
          })
        ) {
          node.kind = 'let'
        }
      },
    },
  }
}
