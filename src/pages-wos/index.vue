<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .wos-bg{
    padding: 25px;
    background-color: $primary;
    background-image: -webkit-linear-gradient(top, $primary, $blue-1); /* Chrome 10-25, iOS 5+, Safari 5.1+ */
    background-image:         linear-gradient(to bottom, $primary, $blue-1); /* Chrome 26, Firefox 16+, IE 10+, Opera */
  }
  .user-image {
    padding: 3px;
    background: rgba(234, 234, 234, .3);
  }
  .mint-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }
  .mint-flex-item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }
  .tag-box {
    .tag {
      border-right: 1px dotted rgba($primary,0.3);
    }
    .current {
      color: $primary;
      border-bottom: 2px solid $primary;
    }
  }
</style>

<template>
  <div>
    <app-view :hasFooter="false">
      <router-link class="a-default" :to="'/wos/personal/' + curUser.id + '/index'">
        <div class="wos-bg padding-left-m padding-right-m padding-top-xxl padding-bottom-xxl ripple">
          <div class="flex">
            <a class="a-default">
              <img class="img-circle user-image" :src="$filters.avatar(curUser.avatar)" width="62" height="62"/>
            </a>
            <div class="valign-center">
              <div class="color-white margin-left-m">
                <div class="font-m font-bold-600">{{curUser.nickname}}</div>
                <div class="margin-top font-s">
                  <div class="br-wrapper br-theme-fontawesome-stars">
                    <star-rating :star-size="18"
                                 :increment="0.5"
                                 active-color="#ffc33c"
                                 inactive-color="transparent"
                                 border-color="#ffc33c"
                                 :border-width="1"
                                 :rating="entity.rating"
                                 :show-rating="false"
                                 :read-only="true"
                                 :inline="true"></star-rating>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </router-link>

      <div class="bg-white align-center">
        <div class="mint-flex flex tag-box">
          <div class="padding-top-m padding-bottom-m border-bottom flex-item" :class="{'current': tag === 'jxz' || !tag }" @click="changeOrder('jxz')">
            <div class="font-bold-400 font-m align-center tag">
              进行中({{ entity.ongoingOrderCount > 99 ? 99 : entity.ongoingOrderCount }})
            </div>
          </div>
          <div class="padding-top-m padding-bottom-m border-bottom flex-item" :class="{'current': tag === 'sy' }" @click="changeOrder('sy')">
            <div class="border-right font-bold-400 font-m align-center">
              全部工单
            </div>
          </div>
        </div>
        <div class="padding-left-m padding-right-m padding-top padding-bottom flex bg-white">
          <div class="key-box flex flex-item">
            <i class="font-lighter iconfont icon-iot-search"></i>
            <input type="text" placeholder="请输入搜索关键字" class="key-input padding-left bg-light" v-model="keywords" @keyup="searchKey($event)">
            <i class="iconfont icon-iot-guanbi font-lighter" @click="clearInput" :style="{'display': keywords.length > 0 ? 'inline-block' : 'none' }"></i>
          </div>
          <div class="margin-left-m font-light valign-center" @click="searchOrder()">
            <i class="iconfont icon-IOT-sx"></i>
            <span>搜索</span>
          </div>
        </div>
      </div>

      <index-order :workOrder="workorders" :type="tag === 'sy' ? 'all' : 'processing'"></index-order>
    </app-view>
  </div>
</template>
<script>
  import types from "@/store/types";
  import indexOrder from "./index-order.vue";
  import StarRating from 'vue-star-rating';

  export default {
    name: "wos-index",
    data() {
      return {
        // 工单数据
        entity: {},
        // 搜索关键词
        keywords: '',
        // 是否正在比较前后两个关键词,与实时搜索有关
        isComparing: false,
        // tag标签
        tag: 'jxz',
        // 工单
        workorders: {}
      }
    },
    computed: {
      // 当前用户
      curUser() {
        return this.$store.getters[types.oauth.getCurUser];
      },
      // 当前tag
//      tag() {
//        let _hash = window.location.hash;
//        return _hash && _hash.split('#') && _hash.split('#')[1];
//      }
    },
    created: function () {
      let that = this;
//      let initOrder = function () {
//        if(that.entity && JSON.stringify(that.entity) !== '{}') {
//          if(!that.tag) {
//            that.workorders = that.entity && that.entity.ongoingOrders;
//          } else {
//            that.searchOrder();
//          }
//        }
//      };

//      let _href = location.href.split('#')[0];
//      that.$store.commit(types.common.setEnterURL, _href);

      that.$store.state.showLoading = true;
      that.$store.commit(types.wos.setServiceData, null);
      let wosData = this.$store.getters[types.wos.getPageData];
      if(wosData && JSON.stringify(wosData) !== '{}') {
        that.entity = wosData;
      } else {
        that.$http.get(`${that.$woshost}/dashboard`)
          .then((resp) => {
            that.$store.commit(types.wos.setPageData, resp);
            that.entity = resp;
          });
      }

      that.searchOrder();
      that.$store.state.showLoading = false;
    },
    // 记录滚动条位置
    beforeRouteLeave(to,from,next) {
      let position = window.scrollY;
      this.$store.commit(types.wos.setScroll, position);
      next();
    },
    // 返回滚动条位置
    beforeRouteEnter(to,from,next) {
      next((vm) => {
        vm.$nextTick(() => {
          let position = vm.$store.getters[types.wos.getScroll];
          window.scroll(0, position);
        })
      })
    },
    mounted() {
      let that = this;
      that.$nextTick(() => {
        let position = that.$store.getters[types.wos.getScroll];
        window.scroll(0, position);
      })
    },
    methods: {
      /**
       * 搜索工单
       */
      searchOrder() {
        let that = this;
        let _type = 'jxz';
        let _hash = window.location.hash;
        if(_hash) {
          that.tag = _hash && _hash.split('#') && _hash.split('#')[1];
        }
        if(that.tag) {
          _type = that.tag;
        }
        let _params = {
          'page_sort': 'created_desc',
          'q': that.keywords,
          'type': _type
        };
        that.$http.get(that.$woshost + '/workorders',_params)
          .then((res) => {
            that.workorders = res.fileList;
            that.$store.state.showLoading = false;
          });
      },
      /**
       * 实时搜索
       */
      autoSearch() {
        if(!this.isComparing) {
          let that = this;
          let _openFlag = false;                //定时器开关标识
          let _compareKey = '';                 //与搜索词进行比较的存储器
          let T = function() {
            that.isComparing = true;            //是否允许比较搜索事件的标志
            if(_openFlag) {
              that.searchOrder();
              that.isComparing = false;
              clearTimeout(T);
              return false;
            }

            if(_compareKey !== that.keywords) {
              _compareKey = that.keywords;
            } else if(!_openFlag) {
              _openFlag = true;
            }

            setTimeout(T,500);
          }
          if(that.keywords.length > 0) {
            T();
          }
        }
      },
      /**
       * 清除输入
       */
      clearInput: function() {
        this.keywords = '';
        this.searchOrder();
      },
      /**
       * 切换工单类型
       * @param type
       */
      changeOrder(type) {
        if(type) {
          window.location.hash = type;
          this.tag = type;
//          this.$router.replace({
//            path: `/wos/index`,
//            query: {
//              tag: type
//            }
//          });
          this.searchOrder();
        }
      },
      /**
       * 判断是否实时搜索还是回车搜索
       * @param e
       */
      searchKey(e) {
        if(e.keyCode === 13) {
          this.searchOrder();
        } else {
          this.autoSearch();
        }
      }
    },
    components: {
      indexOrder,
      StarRating
    }
  }
</script>
