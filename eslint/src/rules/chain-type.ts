import {Rule} from 'eslint'
import {
    isSystemComment,
    SYSTEM_COMMENT_POSITION_ERROR_MESSAGE,
    isProperty,
    isIdentifier,
    isArrayExpression,
    isObjectExpression,
    isLiteral,
    isMemberExpression,
} from '../utils'
import {
    ESLintObjectExpression,
    ESLintExportDefaultDeclaration,
    ESLintIdentifier,
    ESLintExpression,
    ESLintCallExpression,
    ESLintMemberExpression,
} from 'vue-eslint-parser/ast'
import {Node} from 'estree'
import {RouteNode, routesInfo} from './router-info'

const ROUTER_FILE_NAME = 'route-file'
const CHILDREN_KEY_NAME = 'subLevels'
const NAME_KEY_NAME = 'name'

function isSystemRouterComment(comment: string): boolean {
    return new RegExp(`^\\$${ROUTER_FILE_NAME}`).test(comment)
}

/** For webstorm code hint */
class Chain implements Rule.RuleModule {
    meta?: Rule.RuleMetaData = {
        fixable: 'code',
        messages: {},
        schema: [{type: 'object', required: true}],
    }

    private chainWalker(node: Node) {
        const expression = node as ESLintCallExpression

        // TODO 完善类型断言
        if (isObjectExpression(expression.arguments[0] as ESLintExpression)) {
            const {properties} = expression
                .arguments[0] as ESLintObjectExpression

            for (const property of properties) {
                if (
                    isProperty(property) &&
                    isIdentifier(property.key) &&
                    property.key.name === NAME_KEY_NAME
                ) {
                    const chains: string[] = []
                }
            }
        }
    }

    private routesWalker(obj: ESLintObjectExpression) {
        const {properties} = obj
        const result: RouteNode = {name: '', children: []}

        for (const property of properties) {
            if (
                isProperty(property) &&
                isIdentifier(property.key) &&
                (isLiteral(property.value) ||
                    isArrayExpression(property.value) ||
                    isMemberExpression(property.value))
            ) {
                const {
                    key: {name: key},
                } = property

                if (
                    key === NAME_KEY_NAME &&
                    ((isMemberExpression(property.value) &&
                        isIdentifier(property.value.property)) ||
                        isLiteral(property.value))
                ) {
                    let value: string | undefined

                    if (
                        isLiteral(property.value) &&
                        typeof property.value.value === 'string'
                    ) {
                        value = property.value.value
                    } else {
                        value = ((property.value as ESLintMemberExpression)
                            .property as ESLintIdentifier).name
                    }

                    if (typeof value !== 'string' || !value) {
                        continue
                    }

                    result.name = value
                } else if (
                    key === CHILDREN_KEY_NAME &&
                    isArrayExpression(property.value)
                ) {
                    const {elements} = property.value

                    for (const obj of elements) {
                        if (isObjectExpression(obj)) {
                            result.children.push(this.routesWalker(obj))
                        }
                    }
                }
            }
        }

        return result
    }

    // bind this
    private ExportDefaultDeclarationProcessor = (node: Node) => {
        const {declaration} = node as ESLintExportDefaultDeclaration
        const collectRouteInfo = this.routesWalker(
            declaration as ESLintObjectExpression,
        )

        if (collectRouteInfo) {
            routesInfo[collectRouteInfo.name] = collectRouteInfo
        }
    }

    create(context: Rule.RuleContext): Rule.RuleListener {
        const comments = context.getSourceCode().getAllComments()
        const firstComment = comments[0]

        if (firstComment) {
            const {value} = firstComment
            const {
                start: {line},
            } = firstComment.loc!

            // system comment must be on the first line of editor
            if (line !== 1 && isSystemComment(value)) {
                throw new Error(SYSTEM_COMMENT_POSITION_ERROR_MESSAGE)
            }

            if (!isSystemRouterComment(value)) {
                return {}
            }
        }

        return {
            // collect routes info
            ExportDefaultDeclaration: this.ExportDefaultDeclarationProcessor,
            CallExpression: this.chainWalker,
        }
    }
}

module.exports = new Chain()
