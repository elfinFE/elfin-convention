const {getStaticPropertyName, getVariableByName} = require('../utils')

module.exports = {
    meta: {
        type: 'suggestion',

        docs: {
            description: 'invalid console',
            category: 'Stylistic Issues',
            recommended: false,
            url: 'https://github.com/elfinFE/elfin-convention.git'
        },

        schema: [
            {
                type: 'object',
                properties: {
                    allow: {
                        type: 'array',
                        items: {
                            type: 'string'
                        },
                        minItems: 1,
                        uniqueItems: true
                    }
                },
                additionalProperties: false
            }
        ],
        deprecated: true,
        replacedBy: [],
        messages: {
            unexpected: 'Unexpected invalid console statement.'
        }
    },

    create(context) {
        const options = context.options[0] || {}
        const allowed = options.allow || []
        const catchDeclaration = ['Program', 'CatchClause']

        /**
         * 判断console方法(log、dir等)是否被允许使用
         * @param reference
         */
        function isAllowed(reference) {
            const node = reference.identifier;
            const parent = node.parent;
            const propertyName = getStaticPropertyName(parent);
            return propertyName && allowed.indexOf(propertyName) !== -1;
        }
        /**
         * report错误信息
         * @param {Object} reference
         */
        function report(reference) {
            const node = reference.identifier.parent;
            context.report({node, message: 'invalid console.'});
        }

        /**
         * 是否是console变量 && console.log() 调用
         * @param {Object} reference
         */
        function isConsole(reference) {
            if (!reference) return false;
            // 身份标明为console
            const isNameConsole = reference.identifier.name === 'console';
            if (!isNameConsole) return false;
            // 是否允许使用
            return !isAllowed(reference)
        }

        /**
         * 判断是否是 dot调用的形式
         * @param {Object} reference
         */
        function isMemberExpressionBlock(reference) {
            const node = reference.identifier;
            const isMemberExpression = node.parent.type === 'MemberExpression';
            const isCommonNode = node.parent.object === node;
            // 是否是在catch作用域
            const isTryCatch = isTryCatchBlock(node);
            return isMemberExpression && isCommonNode && !isTryCatch
        }

        /**
         * 是否是在try-catch中的catch模块中
         * @param {Object} node
         */
        function isTryCatchBlock(node) {
            let ancestor = node.parent;
            while (ancestor && catchDeclaration.indexOf(ancestor.type) < 0) {
                ancestor = ancestor.parent;
            }
            return ancestor && ancestor.type === 'CatchClause';
        }

        return {
            'Program:exit'() {
                const scope = context.getScope();
                const consoleVar = getVariableByName(scope, 'console');
                const shadowed = consoleVar && consoleVar.defs.length > 0;

                const references = consoleVar ? consoleVar.references : scope.through.filter(isConsole);

                if (!shadowed) {
                    // 收集所有的console && 输出
                    references.filter(isMemberExpressionBlock).forEach(report);
                }
            },
        };
    }
};