import {ESLintProperty, ESLintIdentifier} from 'vue-eslint-parser/ast'

export function getNodeName(node: ESLintProperty): string | undefined {
    const {key} = node
    const {name} = key as ESLintIdentifier

    return name
}
