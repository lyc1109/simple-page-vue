<style scoped lang="scss" type="text/scss">
    @import '~variables';
</style>
<template>
  <mt-cell-swipe :title="title"
                 :right="right"
                 :icon="icon"
                 class="cell-swipe">
    <slot></slot>
  </mt-cell-swipe>
</template>
<script>
  export default {
    name: '',
    props: {
      title: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: '' // 可选：back、more
      },
      right: {
        type: Array,
        default: []
      }
    }
  }
</script>
