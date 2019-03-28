import {Rule} from 'eslint'
import {AST} from 'vue-eslint-parser'
import {isVElement} from '../utils'

/** default 4 space use tab*/
const INDENTATION_ERROR_MESSAGE = 'Indentation that is 4 space'

const ROOT_TAG_NAME = 'template'

class Foo implements Rule.RuleModule {
    meta: Rule.RuleMetaData = {
        messages: {
            indentation: INDENTATION_ERROR_MESSAGE,
        },
    }

    walker(node: AST.VElement): boolean {
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

    create(context: Rule.RuleContext): Rule.RuleListener {
        const VElement = (node: AST.VElement) => {
            if (this.walker(node)) {
                context.report({
                    node: node,
                    messageId: 'indentation',
                } as any)
                // vue-eslint-parser cannot provide this type
            }
        }

        const visitor = {
            VElement,
        }

        return context.parserServices.defineTemplateBodyVisitor(visitor)
    }
}

// eslint required
export = new Foo()
