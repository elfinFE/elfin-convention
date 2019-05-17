import {RuleTester, Rule} from 'eslint'

export interface MetaData {
    rule: Rule.RuleModule
    testName: string
}

export abstract class EslintTest {
    abstract metaData: MetaData

    abstract valid(): (string | RuleTester.ValidTestCase)[] | string
    abstract invalid(): RuleTester.InvalidTestCase[]

    runTest(): void {
        const {rule, testName} = this.metaData
        let validCodeBlock = this.valid()

        if (
            !(
                Object.prototype.toString.call(validCodeBlock) ===
                '[Object Array]'
            )
        ) {
            validCodeBlock = [validCodeBlock] as (
                | string
                | RuleTester.ValidTestCase)[]
        }

        new RuleTester().run(testName, rule, {
            valid: validCodeBlock as (string | RuleTester.ValidTestCase)[],
            invalid: this.invalid(),
        })
    }
}
