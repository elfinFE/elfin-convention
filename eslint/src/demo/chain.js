/*$router-file*/
let RouteNamesChain = {}
RouteNamesChain = {
    // 设置
    Setting: RouteNamesChain, // 设置
    Fields: RouteNamesChain, // 字段参数
    Wechat: RouteNamesChain, // 微信设置
    Phone: RouteNamesChain, // 电话显示
    PublicPool: RouteNamesChain, // 公共池设置
}

for (const prop of Object.keys(RouteNamesChain)) {
    RouteNamesChain[prop] = prop
}

// const exportObj = new Proxy(RouteNamesChain, {
//     get(target, prop, receive) {
//         return ''
//     },
// })
