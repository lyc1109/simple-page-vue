<style lang="scss" type="text/scss">
  .loading-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .spinner-box {
    justify-content: center;
  }
</style>
<template>
<div>
  <div class="padding align-center spinner-box valign-center bg" :class="{ 'loading-box': isAllPage }">
    <div class="center-box">
      <div class="inline-block">
        <mt-spinner type="double-bounce" color="#bbbec4" :size="28"></mt-spinner>
      </div>
      <p class="font-lighter margin-top-s"><slot></slot></p>
    </div>
  </div>
</div>
</template>

<script>
    export default{
      name: "v-spinner",
      props: {
        isAllPage: {
          type: Boolean,
          default: false
        }
      }
    }
</script>
