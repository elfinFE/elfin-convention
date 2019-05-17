import {Rule} from 'eslint'
import {ESLintProgram} from 'vue-eslint-parser/ast'

class RefPrefix implements Rule.RuleModule {
    meta: Rule.RuleMetaData = {}

    create = (context: Rule.RuleContext): Rule.RuleListener => {
        const Program = (program: ESLintProgram) => {}

        return context.parserServices.defineTemplateBodyVisitor({}, {Program})
    }
}

export = new RefPrefix()
