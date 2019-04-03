import {Property, Identifier} from 'estree'

export function getNodeName(node: Property): string | undefined {
    const {key} = node
    const {name} = key as Identifier

    return name
}
