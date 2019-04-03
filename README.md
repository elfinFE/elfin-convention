# elfin-convention

🧚‍♂️ The Convention of elfin bese on TSLint.

## Motivation

- 🍪 能够顺利从 `ESLint` 到 `TSLint`过渡
- 🌹`TypeScript` 的类型约束能够提高代码可维护性以及用上 `DI`
- ☀️`TSLint` 借助 `TypeScript Compiler` 解析生成的 `AST` 更容易被解析
- 🎁将有更多的复杂风格约束被支持，并提供 `Fixer`

## Convention

对代码进行 `parse` 遍历 `AST`，对相应不符合代码规范的进行相应的抛错❌，并提供 `fixer`。

#### vue-template

提供对 `vue` 的 `template` 代码片的检测，符合的代码规范有:

- `tabSize` 为 4 个空格缩进
- 节点`属性`的顺序要求

