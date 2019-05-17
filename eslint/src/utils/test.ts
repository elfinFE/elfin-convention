import {RuleTester, Rule} from 'eslint'

export interface MetaData {
    rule: Rule.RuleModule
    testName: string
}

export abstract class EslintTest {
    protected abstract metaData: MetaData

    protected abstract valid(): (string | RuleTester.ValidTestCase)[]
    protected abstract invalid(): RuleTester.InvalidTestCase[]

    runTest(): void {
        const {rule, testName} = this.metaData

        new RuleTester().run(testName, rule, {
            valid: this.valid(),
            invalid: this.invalid(),
        })
    }
}
