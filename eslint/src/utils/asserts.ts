import {NODE_TYPE} from '../types'
import {
    ESLintStatement,
    ESLintModuleDeclaration,
    ESLintExportDefaultDeclaration,
    ESLintNode,
    VElement,
    VText,
    VExpressionContainer,
} from 'vue-eslint-parser/ast'

function compareNodeType(node: ESLintNode, typeName: string): boolean {
    return node.type === typeName
}

export function isVElement(
    target: VElement | VText | VExpressionContainer,
): target is VElement {
    return !!(target as VElement).name
}

export function isExportDefaultDeclaration(
    node: ESLintStatement | ESLintModuleDeclaration,
): node is ESLintExportDefaultDeclaration {
    return compareNodeType(node, NODE_TYPE.EXPORT_DEFAULT_DECLARATION)
}
