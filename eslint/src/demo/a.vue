<template>
  <div name="foo"></div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
    name: 'bar',
    methods: {
        ...mapActions({
            aaa: 'bbb/sss',
            vxbbb: 'bbb/sss',
            vxccc: 'bbb/sss',
        }),
    },
    computed: {},
}
</script>

<style lang="scss">
</style>
