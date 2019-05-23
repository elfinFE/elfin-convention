import {EslintTest, MetaData} from '../../utils'
import {RuleTester} from 'eslint'
import ComponentsStrict from '../../rules/components-strict'

class ComponentsStrictTest extends EslintTest {
    metaData: MetaData = {
        rule: ComponentsStrict,
        testName: 'component-strict',
    }

    valid(): string | (string | RuleTester.ValidTestCase)[] {
        return [
            `
            export default {
                components: {
                    Hello
                }
            }`,
            `
            export default {
                components: {
                    HelloWorld
                }
            }`,
        ]
    }
    invalid(): RuleTester.InvalidTestCase[] {
        return [
            {
                code: `
                export default {
                    components: {
                        hello
                    }
                }`,
                errors: [
                    {
                        message: 'hello must be the big camel-case',
                    },
                ],
            },
            {
                code: `
                export default {
                    components: {
                        Hello: world
                    }
                }`,
                errors: [
                    {
                        message: 'world must be the big camel-case',
                    },
                ],
            },
            {
                code: `
                export default {
                    components: {
                        hello
                    }
                }`,
                errors: [
                    {
                        message: 'hello must be the big camel-case',
                    },
                ],
            },
        ]
    }
}

new ComponentsStrictTest({
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
}).runTest()
