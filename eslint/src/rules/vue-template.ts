import {Rule} from 'eslint'
import {AST} from 'vue-eslint-parser'
import {isVElement} from '../utils'

class Foo implements Rule.RuleModule {
    meta: Rule.RuleMetaData = {
        messages: {},
    }

    create(context: Rule.RuleContext): Rule.RuleListener {
        function VElement(node: AST.VElement) {
            const {children} = node

            for (const child of children) {
                if (isVElement(child)) {
                    console.info(child.loc.start)
                }
            }
        }

        function Program(node: AST.ESLintProgram) {}

        const visitor = {
            VElement,
            Program,
        }

        return context.parserServices.defineTemplateBodyVisitor(visitor)
    }
}

// eslint required
export = new Foo()
