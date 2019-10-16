import {EslintTest, MetaData} from '../../utils'
import comments from '../../rules/comments'
import {RuleTester} from 'eslint'

class FunctionNoteTest extends EslintTest {
    metaData: MetaData = {
        rule: comments,
        testName: 'comments',
    }

    valid(): string | (string | RuleTester.ValidTestCase)[] {
        return [
            "// Description\nfunction bar() {}",
            "// Description\nvar bar = function() {}",
            "// Description\nexport function bar() {}",
            "/**\n* Description\n */\nfunction bar() {}",
            "/**\nDescription\n*/\nfunction bar() {}",
            "/**\nDescription\n*/\nvar bar = function() {}",
            "/**\n* Description\n */\nexport function bar() {}",
            "var bar = {bar1: function() {}}",
            "var bar = {bar1: function() {}}",
            "// Description\nfunction bar() {function bar1() {}}",
            "/**\n* Description\n */\nfunction bar() {function bar1() {}}",
            `export default {
                data() {
                    return {}
                },
                computed: {
                    bar() {},
                },
                methods: {
                    bar() {},
                },
                mounted() {},
            }`,
        ]
    }

    invalid(): RuleTester.InvalidTestCase[] {
        return [
            {
                code: "function bar() {}",
                errors: [{message: "Missing function comment."}],
            },
            {
                code: "var bar = function() {}",
                errors: [{message: "Missing function comment."}],
            },
            {
                code: "function bar() {function bar1() {}}",
                errors: [{message: "Missing function comment."}],
            },
            {
                code: "export function bar() {}",
                errors: [{message: "Missing function comment."}],
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
