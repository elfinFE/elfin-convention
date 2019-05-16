module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
    },
    extends: ['plugin:vue/strongly-recommended', 'eslint:recommended'],
    // 预定义一些全局变量
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },
    // 全局变量
    // true 表示可以修改
    // false 表示不可以修改
    globals: {
        Vue: true,
        httpRequestor: true,
        devEnv: true,
        gStoragePrefix: false,
        gStaticPath: false,
        components: false,
        utils: false,
        svg: false,
        api: false,
        common: false,
        glodash: false,
        jest: true,
        RouteNames: false,
        RouteNamesChain: false,
    },
    // add your custom rules here
    rules: {
        'vue/html-indent': [
            'error',
            4,
            {
                baseIndent: 1,
            },
        ],
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'never',
                    component: 'never',
                },
                svg: 'always',
                math: 'always',
            },
        ],
        'vue/name-property-casing': ['error', 'kebab-case'],
        'vue/html-closing-bracket-newline': [
            'error',
            {
                singleline: 'never',
                multiline: 'never',
            },
        ],
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/attribute-hyphenation': ['error', 'never'],
        'vue/order-in-components': [
            'error',
            {
                order: [
                    'el',
                    'name',
                    'parent',
                    'directives',
                    'components',
                    'extends',
                    'mixins',
                    'data',
                    'props',
                    'computed',
                    'filters',
                    'methods',
                    'watch',
                    ['template', 'render'],
                    'LIFECYCLE_HOOKS',
                    'errorCaptured',
                ],
            },
        ],
        'vue/attributes-order': [
            'error',
            {
                order: [
                    'CONDITIONALS',
                    'LIST_RENDERING',
                    'RENDER_MODIFIERS',
                    'TWO_WAY_BINDING',
                    'OTHER_DIRECTIVES',
                    'DEFINITION',
                    'GLOBAL',
                    'UNIQUE',
                    'OTHER_ATTR',
                    'EVENTS',
                    'CONTENT',
                ],
            },
        ],
        'no-console': [
            'error',
            {
                allow: ['warn', 'error', 'log', 'info'],
            },
        ],
        'vue/max-attributes-per-line': [
            'error',
            {
                singleline: 2,
                multiline: {
                    max: 1,
                    allowFirstLine: false,
                },
            },
        ],
        'vue/html-closing-bracket-spacing': [
            'error',
            {
                startTag: 'never',
                endTag: 'never',
                selfClosingTag: 'never',
            },
        ],
    },
}
