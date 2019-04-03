import {Rule} from 'eslint'
import 'vue-eslint-parser'
import {
    isVElement,
    getNodeName,
    isExportDefaultDeclaration,
    isSpreadElement,
    isProperty,
    isCallExpression,
    isIdentifier,
    isObjectExpression,
    hasPrefix,
    attachFailures,
} from '../utils'
import {
    ESLintProgram,
    VElement,
    ESLintExportDefaultDeclaration,
    ESLintObjectExpression,
    ESLintProperty,
    ESLintSpreadElement,
    ESLintLegacySpreadProperty,
} from 'vue-eslint-parser/ast'
import {VUE_META} from '../types'

/** default 4 space use tab*/
const INDENTATION_ERROR_MESSAGE = 'Indentation that is 4 space.'
const VUEX_PREFIX_ERROR_MESSAGE = 'Need vx prefix here.'

const ROOT_TAG_NAME = 'template'

class Foo implements Rule.RuleModule {
    meta: Rule.RuleMetaData = {
        fixable:'code',
        messages: {
            indentation: INDENTATION_ERROR_MESSAGE,
            vuex: VUEX_PREFIX_ERROR_MESSAGE
        },
        schema:[]
    }

    create(context: Rule.RuleContext): Rule.RuleListener {
        const VElement = (node: VElement) => {
            attachFailures(context, this.ASTWalker(node))
        }

        const Program = (node: ESLintProgram) => {
            attachFailures(context, this.scriptWalker(node))
        }

        return context.parserServices.defineTemplateBodyVisitor(
            {VElement},
            {Program},
        )
    }

    ASTWalker(node: VElement): Rule.ReportDescriptor[] {
        if (isVElement(node)) {
            const col = node.loc.start.column
            const parentCol = node.parent.loc.start.column
            const descriptors: Rule.ReportDescriptor[] = []

            if (node.name !== ROOT_TAG_NAME) {
                // 元素顶格 || 空格缩进
                if (col === 0 || col - parentCol !== 4) {
                    descriptors.push({
                        messageId:'indentation',
                        loc:node.loc
                    })
                }
            }

            return descriptors
        }

        return []
    }

    vuexLint(exportDefaultExpression: ESLintObjectExpression): Rule.ReportDescriptor[] {
        const validateFields = ['mapActions', 'mapGetters', 'mapState']
        const properties = exportDefaultExpression.properties
        const descriptors: Rule.ReportDescriptor[] = []
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
            let properties: undefined | (ESLintProperty
                | ESLintSpreadElement
                | ESLintLegacySpreadProperty)[]

            for (const property of methodsExpression.properties) {
                if (
                    isSpreadElement(property) &&
                    isCallExpression(property.argument) &&
                    isIdentifier(property.argument.callee) &&
                    validateFields.includes(property.argument.callee.name)
                ) {
                    const [objectLiteral] = property.argument.arguments

                    if (isObjectExpression(objectLiteral)) {
                        properties = objectLiteral.properties
                    }
                }
            }

            if(properties){
                for(const property of properties){
                    if(isProperty(property) && isIdentifier(property.key)){
                        const {name} = property.key

                        if(!hasPrefix(name, 'vx')){
                            descriptors.push({
                                messageId: 'vuex',
                                loc: property.loc
                            })
                        }
                    }
                }
            }
        }

        return descriptors
    }

    scriptWalker(node: ESLintProgram): Rule.ReportDescriptor[] {
        const {body: scriptBody} = node
        let exportDefaultNode: undefined | ESLintExportDefaultDeclaration

        for (const node of scriptBody) {
            if (isExportDefaultDeclaration(node)) {
                exportDefaultNode = node as ESLintExportDefaultDeclaration
            }
        }

        if (!exportDefaultNode) {
            return []
        }

        const exportDefaultExpression = exportDefaultNode.declaration as ESLintObjectExpression

        // 处理 vuex vx前缀检测
        return this.vuexLint(exportDefaultExpression)
    }
}

// eslint required
export = new Foo()
