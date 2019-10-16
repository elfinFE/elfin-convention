import {ESLintProperty, ESLintIdentifier} from 'vue-eslint-parser/ast'

export function getNodeName(node: ESLintProperty): string | undefined {
    const {key} = node
    const {name} = key as ESLintIdentifier

    return name
}

/**
 * Gets the property name of a given node.
 * The node can be a MemberExpression, a Property, or a MethodDefinition.
 *
 * If the name is dynamic, this returns `null`.
 *
 * For examples:
 *
 *     a.b           // => "b"
 *     a["b"]        // => "b"
 *     a['b']        // => "b"
 *     a[`b`]        // => "b"
 *     a[100]        // => "100"
 *     a[b]          // => null
 *     a["a" + "b"]  // => null
 *     a[tag`b`]     // => null
 *     a[`${b}`]     // => null
 *
 *     let a = {b: 1}            // => "b"
 *     let a = {["b"]: 1}        // => "b"
 *     let a = {['b']: 1}        // => "b"
 *     let a = {[`b`]: 1}        // => "b"
 *     let a = {[100]: 1}        // => "100"
 *     let a = {[b]: 1}          // => null
 *     let a = {["a" + "b"]: 1}  // => null
 *     let a = {[tag`b`]: 1}     // => null
 *     let a = {[`${b}`]: 1}     // => null
 *
 * @param {Object} node - The node to get.
 * @returns {string|null} The property name if static. Otherwise, null.
 */
export function getStaticPropertyName(node: any) {
    let prop;

    switch (node && node.type) {
        case "Property":
        case 'MethodDefinition':
            prop = node.key;
            break;

        case "MemberExpression":
            prop = node.property;
            break;

        // no default
    }

    switch (prop && prop.type) {
        case "Literal":
            return String(prop.value);

        case "TemplateLiteral":
            if (prop.expressions.length === 0 && prop.quasis.length === 1) {
                return prop.quasis[0].value.cooked;
            }
            break;

        case "Identifier":
            if (!node.computed) {
                return prop.name;
            }
            break;

        // no default
    }

    return null;
}

/**
 * Finds the variable by a given name in a given scope and its upper scopes.
 *
 * @param {eslint-scope.Scope} initScope - A scope to start find.
 * @param {string} name - A variable name to find.
 * @returns {eslint-scope.Variable|null} A found variable or `null`.
 */
export function getVariableByName(initScope: any, name: String) {
    let scope = initScope;

    while (scope) {
        const variable = scope.set.get(name);

        if (variable) {
            return variable;
        }

        scope = scope.upper;
    }

    return null;
}