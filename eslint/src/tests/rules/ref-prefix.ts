import {EslintTest, MetaData} from '../../utils'
import refPrefix from '../../rules/ref-prefix'
import {RuleTester} from 'eslint'

class VxRefPrefix extends EslintTest {
    metaData: MetaData = {
        rule: refPrefix,
        testName: 'vx',
    }

    valid(): string | (string | RuleTester.ValidTestCase)[] {
        return [
            `function bar(){
                this.$refs.A.refFoo()
            }`,
            `export default {
                computed: {
                    bar(){
                        this.$refs.A.refFoo()
                        let foo = this.$refs.A.refFoo()
                        return this.$refs.A.refFoo()
                    }
                }
            }`,
            `export default {
                methods: {
                    bar(){
                        this.$refs.A.refFoo()
                        let foo = this.$refs.A.refFoo()
                        return this.$refs.A.refFoo()
                    }
                }
            }`,
            `export default {
                computed: {
                    bar(){
                        this.$refs.A.refFoo()
                        let foo = this.$refs.A.refFoo()
                        return this.$refs.A.refFoo()
                    }
                },
                methods: {
                    bar(){
                        this.$refs.A.refFoo()
                        let foo = this.$refs.A.refFoo()
                        return this.$refs.A.refFoo()
                    }
                }
            }`,
            `export default {
                methods: {
                    bar(){
                        return $refs.A.Foo()
                    }
                }
            }`,
            `export default {
                methods: {
                    bar(){
                        this.A.Foo()
                    }
                }
            }`,
            `export default {
                methods: {
                    bar(){
                        this.$refs.A.asd.refFoo()
                    }
                }
            }`,
            `export default {
                methods: {
                    bar(){
                        let a = this.$refs.bar.foo
                        a = 1
                    }
                }
            }`,
            `export default {
                methods: {
                    bar(){
                        let a = this.$refs.bar.refFoo
                        a()
                    }
                }
            }`,
            `export default {
                methods: {
                    bar(){
                        let a = this.$refs.bar
                        a.refFoo()
                    }
                }
            }`,
            `export default {
                methods: {
                    bar(){
                        let a = this.$refs
                        a.bar.refFoo()
                    }
                }
            }`,
            `export default {
                methods: {
                    bar(){
                        let a = this.$refs
                        a.bar.refFoo()
                    }
                }
            }`,
        ]
    }
    invalid(): RuleTester.InvalidTestCase[] {
        return [
            {
                code: `
                export default {
                    methods: {
                        bar(){
                            this.$refs.A.Foo()
                        }
                    }
                }
                `,
                errors: [
                    {
                        message: "Foo must have the 'ref' prefix",
                    },
                ],
            },
            {
                code: `
                export default {
                    methods: {
                        bar(){
                            return this.$refs.A.Foo()
                        }
                    }
                }`,
                errors: [
                    {
                        message: "Foo must have the 'ref' prefix",
                    },
                ],
            },
            {
                code: `export default {
                    methods: {
                        bar(){
                            let a = this.$refs.bar

                            a.Foo();
                        }
                    }
                }`,
                errors: [
                    {
                        message: "Foo must have the 'ref' prefix",
                    },
                ],
            },
            {
                code: `export default {
                    methods: {
                        bar(){
                            let a = this.$refs.B.$refs
                            a.B.C()
                        }
                    }
                }`,
                errors: [
                    {
                        message: "C must have the 'ref' prefix",
                    },
                ],
            },
            {
                code: `export default {
                    methods: {
                        bar(){
                            let a = this.$refs
                            a.bar.Foo()
                        }
                    }
                }`,
                errors: [
                    {
                        message: "Foo must have the 'ref' prefix",
                    },
                ],
            },
            {
                code: `export default {
                    methods: {
                        bar(){
                            let a = this.$refs.bar.Foo

                            a();
                        }
                    }
                }`,
                errors: [
                    {
                        message: "Foo must have the 'ref' prefix",
                    },
                ],
            },
        ]
    }
}

new VxRefPrefix({
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
}).runTest()
