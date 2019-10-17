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
            {
                code: `
                    try {
                        // xxx
                    }
                    catch(e) {
                        console.log(e)
                        throw e
                    }
                `,
            },
            {
                code: 'console.log(111)',
                options: [{allow: ['log']}]
            },
            {
                code: 'console.log(111)\nconsole.log(222)',
                options: [{allow: ['log']}]
            },
            {
                code: 'console.error(111)',
                options: [{allow: ['error']}]
            },
            {
                code: 'console.warn(111)',
                options: [{allow: ['warn', 'error']}]
            },
            "console(111)",
            "const console = require('temp-console');\nconsole(111)",
            "const console = require('temp-console');\nconsole.log(111)",
        ]
    }

    invalid(): RuleTester.InvalidTestCase[] {
        return [
            {
                code: 'console.log(111)',
                errors: [{message: 'invalid console.'}],
            },
            {
                code: 'console.dir(111)',
                errors: [{message: 'invalid console.'}],
            },
            {
                code: 'console.log(111)\nconsole.error(222)',
                options: [{allow: ['log']}],
                errors: [{message: 'invalid console.'}],
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
                errors: [{message: 'invalid console.'}],
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
