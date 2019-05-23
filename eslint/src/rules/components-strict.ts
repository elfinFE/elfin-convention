import {Rule} from 'eslint'
import {
    ESLintExportDefaultDeclaration,
    LocationRange,
} from 'vue-eslint-parser/ast'
import {
    isObjectExpression,
    isProperty,
    isIdentifier,
    attachFailures,
} from '../utils'

const HIT_BLOCK_NAME = 'components'

class ComponentStrict implements Rule.RuleModule {
    meta?: Rule.RuleMetaData = {
        fixable: 'code',
    }

    private componentsBlockChecker(
        node: ESLintExportDefaultDeclaration,
    ): Rule.ReportDescriptor[] {
        const {declaration} = node
        const failures: Rule.ReportDescriptor[] = []

        const addFailure = (fieldName: string, loc: LocationRange) =>
            failures.push({
                message: '{{ fieldName }} must be the big camel-case',
                data: {
                    fieldName: fieldName,
                },
                loc: loc,
            })

        if (isObjectExpression(declaration)) {
            const {properties} = declaration

            for (const property of properties) {
                if (isProperty(property)) {
                    const {key, value} = property

                    if (
                        isIdentifier(key) &&
                        key.name === HIT_BLOCK_NAME &&
                        isObjectExpression(value)
                    ) {
                        const {properties} = value

                        for (const property of properties) {
                            if (isProperty(property)) {
                                const {key, value} = property

                                if (
                                    isIdentifier(key) &&
                                    !isBigCamelCase(key.name)
                                ) {
                                    addFailure(key.name, key.loc)
                                }

                                if (
                                    isIdentifier(key) &&
                                    isIdentifier(value) &&
                                    !isBigCamelCase(value.name) &&
                                    key.name !== value.name
                                ) {
                                    addFailure(value.name, value.loc)
                                }
                            }
                        }
                    }
                }
            }
        }

        return failures
    }

    create = (context: Rule.RuleContext): Rule.RuleListener => {
        const exportDefaultDeclarationWalker = (
            node: ESLintExportDefaultDeclaration,
        ) => {
            attachFailures(context, this.componentsBlockChecker(node))
        }

        return context.parserServices.defineTemplateBodyVisitor(
            {},
            {
                ExportDefaultDeclaration: exportDefaultDeclarationWalker,
            },
        )
    }
}

export = new ComponentStrict()

function isBigCamelCase(str: string) {
    return /^[A-Z][A-Za-z]*[a-z]$/.test(str)
}
