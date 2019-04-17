/*$route-file */
import {RouteNamesChain} from '@/common/const/route'
import {detail as authority} from '@common/authority'

export default {
    path: 'xkjl',
    name: RouteNamesChain.Xkjl,
    subLevels: [
        {
            path: 'develop',
            name: RouteNamesChain.Develop,
            component: xkjl,
            meta: {
                auths: [authority.FE_SIDE_MENU_DEVELOP.code],
            },
        },
        // 貌似已经弃用？？
        {path: 'workbench', name: 'onlineMall', component: mallWorkbench},
        {
            path: 'goods',
            name: RouteNamesChain.Goods,
            component: mallGoods,
            subLevels: [
                {
                    path: 'add-new',
                    name: RouteNamesChain.Create,
                    component: mallAddGoods,
                },
                {
                    path: ':commodityId',
                    name: RouteNamesChain.Detail,
                    component: mallGoodsInfo,
                    props: true,
                },
            ],
        },
        {
            path: 'system/settings',
            name: RouteNamesChain.Setting,
            component: mallSystem,
        },
        {
            path: 'homePage/settings',
            name: RouteNamesChain.Homepage,
            component: mallPage,
        },
        {
            path: 'order',
            name: RouteNamesChain.Order,
            component: mallOrder,
        },
        {
            path: 'group-goods',
            name: RouteNamesChain.GroupGoods,
            component: groupGoods,
            subLevels: [
                {
                    path: ':groupCommodityId',
                    name: RouteNamesChain.Detail,
                    component: groupGoodsInfo,
                    props: true,
                },
                {
                    path: 'result',
                    name: RouteNamesChain.Result,
                    component: addGroupMallResult,
                },
            ],
        },
        {
            path: 'withdraw',
            name: RouteNamesChain.Withdraw,
            component: withdraw,
            meta: {
                auths: [authority.ORGANIZATION_DRAW_CASH.code],
            },
            subLevels: [
                {
                    path: 'handle-withdraw',
                    name: RouteNamesChain.Action,
                    component: handleWithdraw,
                },
                {
                    path: 'bind-card',
                    name: RouteNamesChain.BindCard,
                    component: bindCard,
                },
            ],
        },
        // 海报秀路由
        {
            path: 'posters-show',
            name: RouteNamesChain.Postshow,
            component: postersShow,
            subLevels: [
                {
                    path: 'edit/:posterId',
                    name: RouteNamesChain.Edit,
                    component: editPosters,
                    props: true,
                },
            ],
        },
        // 活动秀路由
        {
            path: 'activity-show',
            name: RouteNamesChain.ActivityShow,
            component: activityShow,
            subLevels: [
                {
                    path: 'detail/:activityId',
                    name: RouteNamesChain.Detail,
                    component: activityDetail,
                    props: true,
                },
            ],
        },
        {
            path: 'mall-coupons',
            name: RouteNamesChain.Coupon,
            component: coupons,
            subLevels: [
                {
                    path: 'coupon-record',
                    name: RouteNamesChain.CouponRecord,
                    component: couponRecord,
                },
                {
                    path: 'new-coupons',
                    name: RouteNamesChain.NewCoupon,
                    component: newCoupons,
                },
                {
                    path: 'collect-coupons-info',
                    name: RouteNamesChain.CollectCouponInfo,
                    component: collectCouponsInfo,
                },
                {
                    path: 'coupons-promote',
                    name: RouteNamesChain.CouponPromote,
                    component: couponsPromote,
                },
            ],
        },
        // 申请页面，无侧边栏
        {path: 'landing-page', name: 'landingPage', component: landingPage},
    ],
}
