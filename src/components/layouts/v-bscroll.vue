<!--
 * 基于better-scroll封装的滚动组件，提升移动端的滚动体验
 * @author  hucw
 * @created 2018-04-26
 *-->
<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <div class="v-bscroll-wrapper" ref="bscroll" :style="scrollWrapperStyle">
    <div class="v-bscroll-content" :style="scrollContentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import storeTypes from "@/store/types";

  export default {
    name: "v-bscroll",
    desc: "基于better-scroll封装的滚动组件，提升移动端的滚动体验",
    props: {
      // 是否启用优化滚动体验，默认为false
      enableScroll: {
        type: Boolean,
        default: false
      },
      // 父组件相关数据，用于异步请求后刷新scroll确保滚动效果
      scrollData: {
        type: Object,
        default: null
      },
      // 是否记录还原滚动位置
      restoreScroll: {
        type: Boolean,
        default: false
      },
      // 启用上拉加载更多
      enablePullup: {
        type: Boolean,
        default: false
      },
    },
    data: function () {
      return {
        // better-scroll实例
        bscroll: null
      }
    },
    computed: {
      // 设置app容器高度
      scrollWrapperStyle: function () {
        if (!this.enableScroll) {
          return "";
        }
        return {
          "height": this.$utils.getScreenHeight() + "px",
          "overflow": "hidden"
        }
      },
      // 设置app内容高度，必须大于容器高度better-scroll才起作用
      scrollContentStyle: function () {
        if (!this.enableScroll) {
          return "";
        }
        return {
          "min-height": (this.$utils.getScreenHeight() + 1) + "px"
        }
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.initBScroll();
      });
    },
    methods: {
      /**
       * 初始化better-scroll
       * 等待dom异步渲染再创建滚动实例，以便提供更好的原生滚动体验
       */
      initBScroll: function() {
        if (this.enableScroll && this.bscroll === null) {
          this.bscroll = new BScroll(this.$refs.bscroll, {
            // 开启点击事件
            click: true,
            // 触发tap事件
            tap: true,
            // 实时触发滚动位置事件
            probeType: 3,
            // 是否启用上拉加载更多
            pullUpLoad: this.enablePullup ? {
              threshold: 100
            } : false,
          });

          // 启用监听滚动事件
          if (this.restoreScroll) {
            this.bscroll.on("scroll", this.onScroll);
          }

          // 启用监听上拉加载更多事件
          if (this.enablePullup) {
            this.bscroll.on('pullingUp', () => {
              this.$emit('onPullingUp', true);
            })
          }
        }
      },
      /**
       * 重新计算滚动范围，以适应数据变化
       */
      refreshBScroll: function () {
        if (this.bscroll === null) {
          this.initBScroll();
        }
        this.bscroll.refresh();

        // 恢复滚动位置
        if (this.restoreScroll) {
          setTimeout(() => { // 延时执行以便数据刷新完毕
            let position = this.$store.getters[storeTypes.scroll.getScrollPosition];
            //console.log("恢复滚动位置：" + JSON.stringify(position));
            if (position.page === this.$route.path) {
              this.bscroll.scrollTo(position.x, position.y, 300);
            }
          }, 300);
        }
      },

      /**
       * 结束上拉加载更多
       */
      finishedPullup: function () {
        this.bscroll.finishPullUp();
      },

      /**
       * 滚动监听，记录每个页面的滚动位置
       * @param position 滚动位置
       */
      onScroll: function (position) {
        //console.log(position);
        let scrollPosition = Object.assign({
          page: this.$route.path,
          x: 0,
          y: 0,
        }, position);
        //console.log("滚动位置：" + JSON.stringify(scrollPosition));
        this.$store.commit(storeTypes.scroll.setScrollPosition, scrollPosition);
      }
    },
    watch: {
      scrollData: function () {
        this.refreshBScroll();
      }
    }
  }
</script>

