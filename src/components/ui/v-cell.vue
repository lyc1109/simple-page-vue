<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .v-cell {
    padding: rem(10px);
    @include border(bottom);

    .flex-title{
      min-width: rem(80px);
      max-width: rem(120px);
      @extend %text-wrapper;
      text-align: left;

      .cell-icon {
        max-width: rem(50px);
      }

      .cell-title{
        font-size: $font-size;
        color: $font-light;
      }
    }

    .cell-value {
      max-width: 100%;
      text-align: right;
      color: $font-title;
    }

    .flex-right{
      color: $font-lighter;
      padding-left: rem(5px);

      i{
        font-size: $font-size-l;
      }
    }
  }

  .v-cell-lg{
    padding: rem(16px);
  }
</style>

<template>
<div class="v-cell">
  <div class="flex">
    <div class="flex-title">
      <div class="flex">
        <div class="cell-icon">
          <slot name="icon"></slot>
        </div>
        <div class="flex-item">
          <slot name="title"><span class="cell-title">{{ title }}</span></slot>
        </div>
      </div>
    </div>

    <div class="flex-item cell-value" :style="valStyle">
      <slot name="value"><div v-html="value"></div></slot>
    </div>

    <div class="flex-right" v-if="isLink"> <i class="fa fa-angle-right"></i> </div>
  </div>
</div>
</template>

<script>
    export default{
      name: "v-cell",
      props: {
        title: {
          type: String,
          default: ""
        },
        value: {
          type: String,
          default: ""
        },
        isLink: {
          type: Boolean,
          default: false
        },
        align: {
          type: String,
          default: "right"
        }
      },
      computed: {
        valStyle: function () {
          return {
            "text-align": this.align
          }
        }
      }
    }
</script>
