<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .empty-page {
    justify-content: center;

    .flex {
      flex-direction: column;
      overflow: hidden;

      .tips {
        width: auto;
        max-width: 150px;
      }
    }
  }
</style>

<template>
<div class="bg-white empty-page valign-center align-center" :style="{ 'height': !isFullHeight ? 'initial' : (wrapperHeight + 'px') }">
  <div v-if="type === 'list'" class="flex">
    <img src="/static/images/empty/no-list.png" class="tips"/>
    <div class="flex-item">
      {{ isFullHeight ? '列表' : '' }}数据空空如也~
    </div>
  </div>
  <div v-else-if="type === 'device'" class="flex">
    <img src="/static/images/empty/no-device.png" class="tips"/>
    <div class="flex-item">
      这里啥都没有~
      <p>好孤单！！</p>
    </div>
  </div>
  <div v-else-if="type === 'community'" class="flex">
    <img src="/static/images/empty/no-community.png" class="tips"/>
    <div class="flex-item">
      这里还没有文章哦~
      <p>该你秀身手了~</p>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: "appEmptyView",
    props: {
      // 页面类型
      type: {
        type: String,
        default: 'list'
      },
      // 是否需要全屏展示
      isFullHeight: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        wrapperHeight: 0
      }
    },
    created() {
      this.wrapperHeight = document.documentElement.clientHeight - 130;
    }
  }
</script>
