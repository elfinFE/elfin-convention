import {Rule} from 'eslint'
import {AST} from 'vue-eslint-parser'
import {
    isVElement,
    getNodeName,
    isExportDefaultDeclaration,
    isSpreadElement,
    isProperty,
    isCallExpression,
} from '../utils'
import {
    ESLintProgram,
    VElement,
    ESLintExportDefaultDeclaration,
    ESLintObjectExpression,
} from 'vue-eslint-parser/ast'
import {VUE_META} from '../types'

/** default 4 space use tab*/
const INDENTATION_ERROR_MESSAGE = 'Indentation that is 4 space'

const ROOT_TAG_NAME = 'template'

class Foo implements Rule.RuleModule {
    meta: Rule.RuleMetaData = {
        messages: {
            indentation: INDENTATION_ERROR_MESSAGE,
        },
    }

    ASTWalker(node: AST.VElement): boolean {
        if (isVElement(node)) {
            const col = node.loc.start.column
            const parentCol = node.parent.loc.start.column

            if (node.name !== ROOT_TAG_NAME) {
                // 元素顶格
                if (col === 0) {
                    return true
                }
                // 空格缩进
                if (col - parentCol !== 4) {
                    return true
                }
            }
        }

        return false
    }

    vuexLint(exportDefaultExpression: ESLintObjectExpression) {
        const validateFields = ['mapActions', 'mapGetters', 'mapState']
        const properties = exportDefaultExpression.properties
        let methodsExpression: undefined | ESLintObjectExpression

        for (const property of properties) {
            if (
                isProperty(property) &&
                getNodeName(property) === VUE_META.METHODS
            ) {
                methodsExpression = property.value as ESLintObjectExpression
            }
        }

        if (methodsExpression) {
            for (const property of methodsExpression.properties) {
                if (
                    isSpreadElement(property) &&
                    isCallExpression(property.argument)
                ) {
                    const {
                        argument: {callee},
                    } = property

                    console.info(getNodeName(callee))
                }
            }
        }

        // for(){

        // }
    }

    scriptWalker(node: ESLintProgram): boolean {
        const {body: scriptBody} = node
        let exportDefaultNode: undefined | ESLintExportDefaultDeclaration

        for (const node of scriptBody) {
            if (isExportDefaultDeclaration(node)) {
                exportDefaultNode = node as ESLintExportDefaultDeclaration
            }
        }

        if (!exportDefaultNode) {
            return false
        }

        const exportDefaultExpression = exportDefaultNode.declaration as ESLintObjectExpression

        // 处理 vuex vx前缀检测
        this.vuexLint(exportDefaultExpression)
    }

    create(context: Rule.RuleContext): Rule.RuleListener {
        const VElement = (node: VElement) => {
            if (this.ASTWalker(node)) {
                context.report({
                    node: node,
                    messageId: 'indentation',
                } as any)
                // vue-eslint-parser cannot provide this type
            }
        }

        const Program = (node: ESLintProgram) => {
            // console.dir(node, {depth: null, colors: true})
            // console.info(node)
            this.scriptWalker(node)
        }

        return context.parserServices.defineTemplateBodyVisitor(
            {VElement},
            {Program},
        )
    }
}

// eslint required
export = new Foo()
