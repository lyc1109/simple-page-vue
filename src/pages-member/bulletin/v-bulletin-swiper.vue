<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .bulletins {
    height: rem(200px);
    background: $white;
  }

  .cover-img{
    position: relative;
    height: rem(200px);
    @extend %bg;
    background-position: center;
  }
</style>

<template>
  <div>
    <mt-swipe class="bulletins" :auto="5000" :prevent="true" :style="swipeStyle" v-if="bulletins.length > 0">
      <mt-swipe-item v-for="bulletin in bulletins" :key="bulletin.id">
        <div class="cover-img" :style="{'background-image': 'url(' + $filters.staticImg(bulletin.coverImagePath, '/resize,m_fixed,h_400') + ')', 'height': height + 'px' }"></div>
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
  export default {
    name: "v-bulletin-swiper",
    props: {
      bulletins: {
        type: Array,
        default: []
      },
      height: {
        type: Number,
        default: 200
      },
    },
    computed: {
      swipeStyle: function () {
        return {
          height: this.height + "px"
        }
      }
    }
  }
</script>

