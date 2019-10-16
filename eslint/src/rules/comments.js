export default {
    meta: {
        type: 'suggestion',

        docs: {
            description: 'require comments',
            category: 'Stylistic Issues',
            recommended: false,
            url: 'https://github.com/elfinFE/elfin-convention.git'
        },

        schema: [
            {
                type: 'object',
                properties: {
                    require: {
                        type: 'object',
                        properties: {
                            FunctionDeclaration: {
                                type: 'boolean',
                                default: true
                            },
                            FunctionExpression: {
                                type: 'boolean',
                                default: true
                            }
                        },
                        additionalProperties: false,
                        default: {}
                    }
                },
                additionalProperties: false
            }
        ],
        deprecated: true,
        replacedBy: []
    },

    create(context) {
        const source = context.getSourceCode();
        const DEFAULT_OPTIONS = {
            FunctionDeclaration: true,
            FunctionExpression: true
        };
        const options = Object.assign(DEFAULT_OPTIONS, context.options[0] && context.options[0].require);
        const fnDeclaration = ['Program', 'FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']

        /**
         * report错误信息
         * @param {Node} node
         */
        function report(node) {
            context.report({node, message: 'Missing function comment.'});
        }

        /**
         * 校验是否有注释
         * @param {Node} node
         */
        function checkComments(node) {
            const jsComment = source.getComments(node);
            const jsDocComment = source.getJSDocComment(node);

            if ((!jsComment || jsComment.leading.length === 0) && !jsDocComment) {
                report(node);
            }
        }

        /**
         * 是否是在外层定义 (不是嵌套定义)
         * @param {Object} node
         */
        function isOuterDeclaration(node) {
            let ancestor = node.parent
            while (ancestor && fnDeclaration.indexOf(ancestor.type) < 0) {
                ancestor = ancestor.parent;
            }

            return !ancestor || ancestor.type === 'Program';
        }

        return {
            // 函数定义 function bar() {}
            FunctionDeclaration(node) {
                if (options.FunctionDeclaration && isOuterDeclaration(node)) {
                    checkComments(node);
                }
            },
            // 函数表达式 var bar = function() {}
            FunctionExpression(node) {
                // 父级是 变量定义的形式
                if (options.FunctionExpression && (node.parent.type === 'VariableDeclarator') && isOuterDeclaration(node)) {
                    checkComments(node);
                }
            },
        };
    }
};