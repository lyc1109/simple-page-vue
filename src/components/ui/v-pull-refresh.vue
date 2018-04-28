<style lang="scss" type="text/scss">
.mint-loadmore {
  min-height: calc(100% - 50px);
}
</style>
<template>
  <div class="page-loadmore-wrapper" ref="pullRefreshWrapper" :style="{ height: wrapperHeight + 'px' }">
    <mt-loadmore :auto-fill="params.autoFill"
                 :distance-index="params.distanceIndex"
                 :max-distance="params.maxDistance"
                 :top-pull-text="params.topPullText"
                 :top-drop-text="params.topDropText"
                 :top-loading-text="params.topLoadingText"
                 :top-distance="params.topDistance"
                 :top-method="loadTop"
                 :bottom-pull-text="params.bottomPullText"
                 :bottom-drop-text="params.bottomDropText"
                 :bottom-loading-text="params.bottomLoadingText"
                 :bottom-distance="params.bottomDistance"
                 :bottom-method="params.bottomMethod"
                 :bottom-all-loaded="params.bottomAllLoaded"
                 @translate-change="translateChange"
                 @top-status-change="handleTopChange"
                 @bottom-status-change="handleBottomChange"
                 ref="loadmore">
      <slot></slot>
    </mt-loadmore>
  </div>
</template>

<script>
    export default {
      name: "v-pull-refresh",
      props: {
        params: {
          default: function() {
            return {
              autoFill: true,                  //[Boolean]     若为真，loadmore 会自动检测并撑满其容器
              distanceIndex: 2,                //[Number]      手指移动与组件移动距离的比值
              maxDistance: 0,                  //[Number]      组件可移动的最大距离（像素），若为 0 则不限制
              topPullText: '下拉刷新',          //[String]      topStatus 为 pull 时加载提示区域的文字
              topDropText: '释放更新',          //[String]      topStatus 为 drop 时加载提示区域的文字
              topLoadingText: '加载中...',      //[String]      topStatus 为 loading 时加载提示区域的文字
              topDistance: 70,                 //[Number]      触发 topMethod 的下拉距离阈值（像素）
              bottomPullText: '上拉刷新',       //[String]      bottomStatus 为 pull 时加载提示区域的文字
              bottomDropText: '释放更新',       //[String]      bottomStatus 为 drop 时加载提示区域的文字
              bottomLoadingText: '加载中...',   //[String]      bottomStatus 为 loading 时加载提示区域的文字
              bottomDistance: 70,              //[Number]      触发 bottomMethod 的上拉距离阈值（像素）
              bottomAllLoaded: false           //[Boolean]     若为真，则 bottomMethod 不会被再次触发
            }
          }
        },
        events: {
          default: function() {
            return {
              topStatusChange: undefined,      //[Funcition]   组件顶部状态发生变化时的回调函数
              bottomStatusChange: undefined,   //[Funcition]   组件底部状态发生变化时的回调函数
              topMethod: undefined,            //[Funcition]   下拉刷新执行的方法
              bottomMethod: undefined          //[Funcition]   上拉刷新执行的方法
            }
          }
        }
      },
      data() {
        return {
          topStatus: '',
          wrapperHeight: 0,
          translate: 0,
          moveTranslate: 0
        }
      },
      methods: {
        /**
         * 组件顶部状态发生变化时的回调函数
         * @param status
         */
        handleTopChange(status) {
          this.moveTranslate = 1;
          this.topStatus = status;

          if(this.events.topStatusChange) {
            this.events.topStatusChange(status);
          }
        },
        /**
         * 组件底部状态发生变化时的回调函数
         * @param status
         */
        handleBottomChange(status) {
          if(this.events.bottomStatusChange) {
            this.events.bottomStatusChange(status);
          }
        },
        /**
         * 改变时的操作
         * @param status
         */
        translateChange(translate) {
          const translateNum = +translate;
          this.translate = translateNum.toFixed(2);
          this.moveTranslate = (1 + translateNum / 70).toFixed(2);
        },
        /**
         * 下拉刷新执行的方法
         */
        loadTop() {
          setTimeout(() => {
            this.$refs.loadmore.onTopLoaded();
            if(this.events.topMethod) {
              this.events.topMethod();
            }
          }, 1500);
        }
      },
      mounted() {
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.pullRefreshWrapper.getBoundingClientRect().top - 60;
      }
    }
</script>
