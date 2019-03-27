import {AbstractWalker, RuleFailure, Rules, IRuleMetadata} from 'tslint/lib'
import TypeScript from 'typescript'

export class Rule extends Rules.AbstractRule {
    apply(sourceFile: TypeScript.SourceFile): RuleFailure[] {
        return this.applyWithWalker(
            new VueHtmlTemplateWalker(
                sourceFile,
                Rule.metadata.ruleName,
                undefined,
            ),
        )
    }

    static metadata: IRuleMetadata = {
        ruleName: 'vue-html-template',
        description: '',
        optionsDescription: '',
        options: undefined,
        type: 'maintainability',
        hasFix: false,
        typescriptOnly: false,
    }
}

export class VueHtmlTemplateWalker extends AbstractWalker<undefined> {
    walk(): void {
        const sourceFile = this.sourceFile

        console.info(sourceFile.fileName)
    }
}
