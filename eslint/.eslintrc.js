const baseConfig = require('./configs/rules')

baseConfig.rules = {...baseConfig.rules, ...{
    "vx-prefix": 1,
}}

module.exports = baseConfig
