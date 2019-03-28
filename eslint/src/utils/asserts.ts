import {AST} from 'vue-eslint-parser'

export function isVElement(
    target: AST.VElement | AST.VText | AST.VExpressionContainer,
): target is AST.VElement {
    return !!(target as AST.VElement).name
}
