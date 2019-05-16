module.exports = {
    extends: ['plugin:vue/base'],

    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 6,
        sourceType: 'module',
    },
    rules: {
        'chain-type': 1,
        'router-chain-type-checker': 1,
    },
}
