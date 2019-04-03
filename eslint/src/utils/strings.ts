export function hasPrefix(str: string, prefix: string): boolean {
    return new RegExp(`^${prefix}`).test(str)
}

export function hasSuffix(str: string, suffix: string): boolean {
    return new RegExp(`${suffix}$`).test(str)
}
