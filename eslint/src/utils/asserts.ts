import {NODE_TYPE} from '../types'
import {
    ESLintStatement,
    ESLintModuleDeclaration,
    ESLintExportDefaultDeclaration,
    ESLintNode,
    VElement,
    VText,
    VExpressionContainer,
    ESLintSpreadElement,
    ESLintProperty,
    ESLintLegacySpreadProperty,
    ESLintCallExpression,
    ESLintIdentifier,
} from 'vue-eslint-parser/ast'

function compareNodeType(
    node: ESLintNode | ESLintLegacySpreadProperty,
    typeName: string,
): boolean {
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

export function isSpreadElement(
    node: ESLintNode | ESLintLegacySpreadProperty,
): node is ESLintSpreadElement {
    return compareNodeType(node, NODE_TYPE.SPREAD_ELEMENT)
}

export function isProperty(
    node:
        | ESLintNode
        | ESLintProperty
        | ESLintSpreadElement
        | ESLintLegacySpreadProperty,
): node is ESLintProperty {
    return compareNodeType(node, NODE_TYPE.PROPERTY)
}

export function isCallExpression(
    node: ESLintNode | ESLintLegacySpreadProperty,
): node is ESLintCallExpression {
    return compareNodeType(node, NODE_TYPE.CALL_EXPRESSION)
}

export function isIdentifier(
    node: ESLintNode | ESLintLegacySpreadProperty,
): node is ESLintIdentifier {
    return compareNodeType(node, NODE_TYPE.IDENTIFIER)
}
