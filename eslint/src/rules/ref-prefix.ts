import {Rule} from 'eslint'
import {
    ESLintCallExpression,
    ESLintVariableDeclarator,
    LocationRange,
    ESLintAssignmentExpression,
    ESLintBlockStatement,
    ESLintNode,
} from 'vue-eslint-parser/ast'
import {
    isMemberExpression,
    isThisExpression,
    attachFailures,
    isIdentifier,
    hasPrefix,
    isVariableDeclaration,
    isVariableDeclarator,
    isExpressionStatement,
    isAssignmentExpression,
    isCallExpression,
} from '../utils'

const NEED_CHECK_PREFIX = 'ref'

type CalleeValue = 'immediately' | 'ref' | 'naked'

function isRefs(str: string): boolean {
    return str === '$refs'
}

interface FailureInfo {
    fieldName: string
    loc: LocationRange
}

interface Reference {
    name: string
    value: CalleeValue
    blockLoc: LocationRange
    failureInfo?: FailureInfo
}

class RefPrefix implements Rule.RuleModule {
    meta: Rule.RuleMetaData = {
        fixable: 'code',
    }

    private refsTracker: Reference[] = []

    private failureAttacher = (
        fieldName: string,
        loc: LocationRange,
    ): Rule.ReportDescriptor[] => {
        if (!hasPrefix(fieldName, NEED_CHECK_PREFIX)) {
            return [
                {
                    message: "{{ fieldName }} must have the 'ref' prefix",
                    loc,
                    data: {
                        fieldName: fieldName,
                    },
                },
            ]
        }

        return []
    }

    private addRef(
        blockLoc: LocationRange,
        value: CalleeValue,
        variableName: string,
        failureInfo?: FailureInfo,
    ): void {
        this.refsTracker.push({
            name: variableName,
            blockLoc,
            value,
            failureInfo,
        })
    }

    // 执行检测的检测器
    private refChecker(
        node: ESLintCallExpression,
        blockLoc: LocationRange,
    ): Rule.ReportDescriptor[] {
        const needThrowFailures: Rule.ReportDescriptor[] = []
        const {callee} = node
        const processRefSet = (
            name: string,
            value: CalleeValue,
            fieldName?: string,
            loc?: LocationRange,
        ): Rule.ReportDescriptor[] => {
            for (const {
                name: refName,
                blockLoc: refBlockLoc,
                value: refValue,
                failureInfo,
            } of this.refsTracker) {
                if (
                    refName === name &&
                    refBlockLoc === blockLoc &&
                    refValue === value
                ) {
                    if (failureInfo) {
                        const {fieldName, loc} = failureInfo

                        return this.failureAttacher(fieldName, loc)
                    }

                    return this.failureAttacher(fieldName!, loc!)
                }
            }

            return []
        }

        // 处理间接 immediately 调用情况
        if (isIdentifier(callee)) {
            const {name} = callee

            needThrowFailures.push(...processRefSet(name, 'immediately'))
        }

        if (isMemberExpression(callee)) {
            const {object, property} = callee
            let isRefCallee = false

            // 处理间接 ref 调用情况
            if (isIdentifier(object) && isIdentifier(property)) {
                const {name} = object
                const {name: fieldName, loc} = property

                needThrowFailures.push(
                    ...processRefSet(name, 'ref', fieldName, loc),
                )
            }

            if (isMemberExpression(object)) {
                const {object: innerObject} = object

                // 处理间接 naked 调用情况
                if (isIdentifier(innerObject) && isIdentifier(property)) {
                    const {name} = innerObject
                    const {name: fieldName, loc} = property

                    needThrowFailures.push(
                        ...processRefSet(name, 'naked', fieldName, loc),
                    )
                }

                // 处理直接调用
                if (
                    isMemberExpression(innerObject) &&
                    isThisExpression(innerObject.object) &&
                    isIdentifier(innerObject.property) &&
                    isRefs(innerObject.property.name)
                ) {
                    isRefCallee = true
                }
            }

            if (isIdentifier(property) && isRefCallee) {
                const {name, loc} = property

                needThrowFailures.push(...this.failureAttacher(name, loc))
            }
        }

        return needThrowFailures
    }

    // 实际执行 引用 收集的收集器
    private innerCollector = (
        left: ESLintNode,
        right: ESLintNode | null,
        blockLoc: LocationRange,
    ): void => {
        let variableName: string | undefined

        interface HasProperty {
            property: ESLintNode
        }

        const judgeAddRef = (
            {property}: HasProperty,
            value: CalleeValue,
            name: string | undefined,
            outerProperty?: ESLintNode,
        ): boolean => {
            if (!name) {
                return false
            }

            if (isIdentifier(property) && isRefs(property.name)) {
                let failureInfo

                if (
                    outerProperty &&
                    isIdentifier(outerProperty) &&
                    value === 'immediately'
                ) {
                    const {name: fieldName, loc} = outerProperty

                    failureInfo = {
                        fieldName: fieldName,
                        loc: loc,
                    }
                }

                // immediately 类型的 ref 可以直接得到错误位置
                this.addRef(blockLoc, value, name, failureInfo)

                return true
            }

            return false
        }

        if (isIdentifier(left)) {
            variableName = left.name
        }

        let layerCount = 0

        interface CalleeValueMap {
            [index: number]: CalleeValue
        }

        const calleeValueMap: CalleeValueMap = {
            0: 'naked',
            1: 'ref',
            2: 'immediately',
        }

        if (!isMemberExpression(right)) {
            return
        }

        const findRef = (node: ESLintNode): CalleeValue | null => {
            if (isMemberExpression(node) && isIdentifier(node.property)) {
                const back = (result: CalleeValue | null) => {
                    if (result && layerCount--) {
                        judgeAddRef(
                            node,
                            calleeValueMap[layerCount],
                            variableName,
                        )
                    }

                    return calleeValueMap[layerCount]
                }

                if (!isRefs(node.property.name)) {
                    layerCount++

                    let result = findRef(node.object)

                    return back(result)
                } else {
                    if (layerCount < 0) {
                        return null
                    }

                    const calleeValue =
                        calleeValueMap[layerCount] || 'immediately'
                    const result = judgeAddRef(
                        node,
                        calleeValue,
                        variableName,
                        calleeValue === 'immediately'
                            ? right.property
                            : undefined,
                    )

                    if (result) {
                        if (layerCount > 2) {
                            layerCount = 2
                        }

                        return calleeValue
                    } else {
                        let result = findRef(node.object)

                        return back(result)
                    }
                }
            }

            return null
        }

        findRef(right)

        // 收集信息
        // isMemberExpression(right) &&
        //     !judgeAddRef(right, 'naked', variableName) &&
        //     isMemberExpression(right.object) &&
        //     !judgeAddRef(right.object, 'ref', variableName) &&
        //     isMemberExpression(right.object.object) &&
        //     !judgeAddRef(
        //         right.object.object,
        //         'immediately',
        //         variableName,
        //         right.property,
        //     )
    }

    private refCollector = (
        expression: ESLintVariableDeclarator,
        blockLoc: LocationRange,
    ): void => {
        const {id, init} = expression

        this.innerCollector(id, init, blockLoc)
    }

    // 跟踪是否移除引用
    private variableRefTracker = (
        expression: ESLintAssignmentExpression,
        blockLoc: LocationRange,
    ) => {
        const {left, right} = expression

        if (isIdentifier(left)) {
            const {name} = left

            for (const ref of this.refsTracker) {
                if (ref.name === name && ref.blockLoc === blockLoc) {
                    this.refsTracker.splice(this.refsTracker.indexOf(ref), 1)

                    // 重新触发收集 ref
                    this.innerCollector(left, right, blockLoc)
                }
            }
        }
    }

    private tracker(
        statement: ESLintBlockStatement,
        context: Rule.RuleContext,
    ) {
        const {body, loc} = statement
        // 等待收集和去除流程走完，执行检查器
        const deferCheckerQueue: Function[] = []
        const deferCheck = (expression: ESLintCallExpression) =>
            deferCheckerQueue.push(() =>
                attachFailures(context, this.refChecker(expression, loc)),
            )

        for (const el of body) {
            if (isVariableDeclaration(el)) {
                const {declarations} = el

                // m * n
                for (const declaration of declarations) {
                    // 跟踪引用
                    if (isVariableDeclarator(declaration)) {
                        this.refCollector(declaration, loc)

                        const {init} = declaration

                        if (init && isCallExpression(init)) {
                            deferCheck(init)
                        }
                    }
                }
            }

            if (isExpressionStatement(el)) {
                const {expression} = el

                if (isCallExpression(expression)) {
                    deferCheck(expression)
                }

                // 根据实际引用值来去留 ref
                if (isAssignmentExpression(expression)) {
                    this.variableRefTracker(expression, loc)

                    const {right} = expression

                    if (isCallExpression(right)) {
                        deferCheck(right)
                    }
                }
            }
        }

        // 延迟执行检查队列
        for (const checker of deferCheckerQueue) {
            checker()
        }
    }

    create = (context: Rule.RuleContext): Rule.RuleListener => {
        const blockStatementWalker = (statement: ESLintBlockStatement) =>
            this.tracker(statement, context)

        return context.parserServices.defineTemplateBodyVisitor(
            {},
            {
                BlockStatement: blockStatementWalker,
            },
        )
    }
}

export = new RefPrefix()
