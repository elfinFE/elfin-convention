import {RuleTester} from 'eslint'
import VxPrefixRule from '../../rules/prefix/vx-prefix'
import {EslintTest, MetaData} from '../../utils'

class VxPrefixTest extends EslintTest {
    metaData: MetaData = {
        rule: VxPrefixRule,
        testName: '[Rule]: vxPrefix',
    }

    valid(): (string | RuleTester.ValidTestCase)[] | string {
        return [
            `export default {
                name: 'bar',
                computed: {
                    ...mapState({
                        vxCurrentCampusId: state => state.organization.currentCampusId,
                        vxOrganizationInfo: state => state.organization.organizationInfo,
                    }),
                }
            }`,
            `export default {
                name: 'bar',
                methods: {
                    ...mapActions({
                        vxFoo: "mall/foo",
                        vxBar: "mall/bar",
                    }),
                }
            }`,
            `export default {
                name: 'bar',
                computed: {
                    ...mapGetters({
                        vxFoo: "mall/foo",
                        vxBar: "mall/bar",
                    }),
                }
            }`,
            `export default {
                name: 'bar',
                computed: {
                    ...mapState({
                        vxCurrentCampusId: state => state.organization.currentCampusId,
                        vxOrganizationInfo: state => state.organization.organizationInfo,
                    }),
                    ...mapGetters({
                        vxFoo: "mall/foo",
                        vxBar: "mall/bar",
                    }),
                },
                methods: {
                    ...mapActions({
                        vxFoo: "mall/foo",
                        vxBar: "mall/bar",
                    }),
                }
            }`,
        ]
    }
    invalid(): RuleTester.InvalidTestCase[] {
        return [
            {
                code: `
                    export default {
                        name: 'bar',
                        computed: {
                            ...mapState({
                                vxCurrentCampusId: state => state.organization.currentCampusId,
                                OrganizationInfo: state => state.organization.organizationInfo,
                            }),
                        }
                    }
                `,
                errors: [
                    {
                        message: "OrganizationInfo must have the 'vx' prefix",
                    },
                ],
            },
            {
                code: `export default {
                    name: 'bar',
                    methods: {
                        ...mapActions({
                            vxFoo: "mall/foo",
                            Bar: "mall/bar",
                        }),
                    }
                }`,
                errors: [
                    {
                        message: "Bar must have the 'vx' prefix",
                    },
                ],
            },
            {
                code: `export default {
                    name: 'bar',
                    computed: {
                        ...mapGetters({
                            Foo: "mall/foo",
                            vxBar: "mall/bar",
                        }),
                    }
                }`,
                errors: [
                    {
                        message: "Foo must have the 'vx' prefix",
                    },
                ],
            },
            {
                code: `export default {
                    name: 'bar',
                    computed: {
                        ...mapState({
                            CurrentCampusId: state => state.organization.currentCampusId,
                            vxOrganizationInfo: state => state.organization.organizationInfo,
                        }),
                        ...mapGetters({
                            vxFooGetter: "mall/foo",
                            barGetter: "mall/bar",
                        }),
                    },
                    methods: {
                        ...mapActions({
                            Foo: "mall/foo",
                            vxBar: "mall/bar",
                        }),
                    }
                }`,
                errors: [
                    {
                        message: "CurrentCampusId must have the 'vx' prefix",
                    },
                    {
                        message: "barGetter must have the 'vx' prefix",
                    },
                    {
                        message: "Foo must have the 'vx' prefix",
                    },
                ],
            },
        ]
    }
}

new VxPrefixTest({
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
}).runTest()
