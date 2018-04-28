<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .v-cell-group {
    @include border(top);
    @include border(bottom);
    padding-left: rem(10px);
    background-color: $white;

    .v-cell{
      padding-left: 0;
    }

    .v-cell:last-child{
      border-bottom-color: transparent;
    }
  }
</style>

<template>
<div class="v-cell-group">
  <slot></slot>
</div>
</template>

<script>
    export default{
      name: "v-cell-group"
    }
</script>
