export default {
    methods: {
        foo() {
            this.$router.open({
                name: RouteNamesChain.Coupon.Bar,
            })
        },
    },
}
