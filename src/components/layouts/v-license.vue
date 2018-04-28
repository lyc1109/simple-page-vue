<!--
 * 品智云技术服务支持License
 * @author  hucw
 * @created 2018-04-26
 *-->
<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .v-license {
    width: 100%;
    padding: rem(30px) 0 rem(70px) 0;
    text-align: center;
    color: $font-light;
    //font-size: rem($font-size-m);
  }
  .v-license-fixed{
    position: fixed;
    bottom: 0;
    z-index: 1;
  }
</style>

<template>
  <div class="v-license">
    <img src="/static/images/logo.png" width="30" height="30" class="valign-middle"/>
    <span class="valign-middle">品智云提供技术服务支持</span>
  </div>
</template>

<script>
  export default {
    name: "v-license"
  }
</script>

