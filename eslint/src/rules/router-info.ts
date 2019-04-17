export interface RouteNode {
    name: string
    children: RouteNode[]
}

export interface RoutesInfo {
    [index: string]: RouteNode
}

/** routes info from router file*/
export const routesInfo: RoutesInfo = {}
