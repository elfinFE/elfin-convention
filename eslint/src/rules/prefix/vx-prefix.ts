import {Rule} from 'eslint'
import 'vue-eslint-parser'
import {
    findDefaultExportObject,
    attachFailures,
    isObjectExpression,
    isProperty,
    isIdentifier,
    isSpreadElement,
    isCallExpression,
    hasPrefix,
} from '../../utils'
import {ESLintProgram, ESLintNode} from 'vue-eslint-parser/ast'

const NEED_CHECK_KEYS = ['mapState', 'mapGetters', 'mapActions']
const NEED_CHECK_PROPERTY_NAMES = ['computed', 'methods']

class VxPrefix implements Rule.RuleModule {
    meta?: Rule.RuleMetaData = {
        fixable: 'code',
    }

    private vxChecker(node: ESLintNode): Rule.ReportDescriptor[] {
        const failures: Rule.ReportDescriptor[] = []

        if (isObjectExpression(node)) {
            const {properties} = node

            for (const property of properties) {
                if (
                    isSpreadElement(property) &&
                    isCallExpression(property.argument) &&
                    isIdentifier(property.argument.callee)
                ) {
                    console.info(property.argument.callee.name)
                }

                if (
                    isSpreadElement(property) &&
                    isCallExpression(property.argument) &&
                    isIdentifier(property.argument.callee) &&
                    NEED_CHECK_KEYS.includes(property.argument.callee.name)
                ) {
                    const {arguments: calleeArgument} = property.argument

                    // 无参数或者有大于 1 个的参数被忽略
                    if (calleeArgument.length !== 1) {
                        return []
                    }

                    const objectExpression = calleeArgument[0]

                    if (isObjectExpression(objectExpression)) {
                        for (const property of objectExpression.properties) {
                            if (
                                isProperty(property) &&
                                isIdentifier(property.key) &&
                                !hasPrefix(property.key.name, 'vx')
                            ) {
                                // has Fix?
                                failures.push({
                                    message:
                                        "{{ fieldName }} must have the 'vx' prefix",
                                    loc: property.key.loc,
                                    data: {
                                        fieldName: property.key.name,
                                    },
                                })
                            }
                        }
                    }
                }
            }
        }

        return failures
    }

    private prefixWalker(program: ESLintProgram): Rule.ReportDescriptor[] {
        const {declaration} = findDefaultExportObject(program)!
        const failures: Rule.ReportDescriptor[] = []

        if (isObjectExpression(declaration)) {
            const {properties} = declaration

            for (const property of properties) {
                if (
                    isProperty(property) &&
                    isIdentifier(property.key) &&
                    NEED_CHECK_PROPERTY_NAMES.includes(property.key.name)
                ) {
                    failures.push(...this.vxChecker(property.value))
                }
            }
        }

        return failures
    }

    create(context: Rule.RuleContext): Rule.RuleListener {
        const Program = (program: ESLintProgram): void => {
            attachFailures(context, this.prefixWalker(program))
        }

        return context.parserServices.defineTemplateBodyVisitor({}, {Program})
    }
}

export = new VxPrefix()
