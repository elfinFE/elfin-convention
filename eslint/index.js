const VxPrefix = require('./dist/rules/vx-prefix')
const RefPrefix = require('./dist/rules/ref-prefix')
const Comments = require('./dist/rules/comments')
const InvalidConsole = require('./dist/rules/invalid-console')

module.exports = {
    rules: {
        'vx-prefix': VxPrefix,
        'ref-prefix': RefPrefix,
        'comments': Comments,
        'invalid-console': InvalidConsole,
    },
}
