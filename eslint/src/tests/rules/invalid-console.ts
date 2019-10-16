import {EslintTest, MetaData} from '../../utils'
import invalidConsole from '../../rules/invalid-console'
import {RuleTester} from 'eslint'

class FunctionNoteTest extends EslintTest {
    metaData: MetaData = {
        rule: invalidConsole,
        testName: 'invalidConsole',
    }

    valid(): string | (string | RuleTester.ValidTestCase)[] {
        return [
            `
            try {
                // xxx
            }
            catch(e) {
                console.log(e)
                throw e
            }
            `
        ]
    }

    invalid(): RuleTester.InvalidTestCase[] {
        return [
            {
                code: "console.log(111)",
                errors: [{message: "invalid console."}],
            },
            {
                code: "console.dir(111)",
                errors: [{message: "invalid console."}],
            },
            {
                code: `
                    try {
                        console.log(111)
                    }
                    catch(e) {
                        console.log(e)
                        throw e
                    }
                `,
                errors: [{message: "invalid console."}],
            },
        ]
    }
}

new FunctionNoteTest({
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
}).runTest()
