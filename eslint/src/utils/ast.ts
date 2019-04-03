import {Property, Identifier, Literal} from 'estree'

export function getNodeName(node: Property): string | undefined {
    const {key} = node
    const {name} = key as Identifier

    return name
}

export function getNodeValue(
    node: Property,
): string | number | boolean | RegExp | null | undefined {
    const {value} = node
    const {value: literalValue} = value as Literal

    return literalValue
}
