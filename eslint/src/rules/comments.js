const {assertHasComment} = require('../utils')

module.exports = {
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
        // 外部函数定义
        const outerFnDeclaration = ['Program', 'FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']
        const varDeclaration = ['Program', 'ExportNamedDeclaration', 'VariableDeclarator', 'VariableDeclaration']

        /**
         * report错误信息
         * @param {Node} node
         */
        function report(node) {
            context.report({node, message: 'Missing function comment.'});
        }

        /**
         * 校验是否有注释
         */
        function checkComments(node) {
            let tempNode = node.parent // 临时节点
            let distance = 1 // 遍历深度
            let hasComment = assertHasComment(source, node); // 是否有注释
            // 有了注释就不继续遍历
            // 遍历最多2层
            // 父级数据需要匹配varDeclaration
            // 场景:
            // export function bar() {}
            // var bar = function() {} jsComment注释
            while (!hasComment && distance <= 3 && tempNode && varDeclaration.indexOf(tempNode.type) >= 0) {
                hasComment = assertHasComment(source, tempNode);
                tempNode = tempNode.parent;
                distance++;
            }
            if (!hasComment) {
                report(node);
            }
        }

        /**
         * 是否是在外层定义 (不是嵌套定义)
         * @param {Object} node
         */
        function isOuterDeclaration(node) {
            let ancestor = node.parent
            while (ancestor && outerFnDeclaration.indexOf(ancestor.type) < 0) {
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