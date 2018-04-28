<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .notice-box {
    overflow: auto;
    .title-box {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }
  }
</style>

<template>
  <div class="full-height" v-if="entity">
    <div class="notice-box bg">
      <div class="padding-m bg-yellow-4 font-default title-box">
        我的消息（{{ entity.totalElements ? entity.totalElements : 0 }}）
      </div>
      <app-view class="has-nav notice-item-box padding-bottom-xxl padding-top-xxl" :hasPullRefresh="true" :pullRefresh="pullRefresh">
        <app-page type="list"
                  :url="page.url"
                  :params="page.params"
                  :storeMutation="page.storeMutation"
                  :storeGetter="page.storeGetter"
                  @loaded="onPageLoaded"
                  class="device-box bg">
          <div v-for="(item, index) in notice"
               class="ripple bg-white border-bottom padding-m flex"
               :class="{ 'font-bold-700': isRead[item.id] === 0 }"
               @click.stop="read(item.id)">
            <div class="flex-item text-wrapper-overline">
              {{ $filters.unEscape(item.content) }}
            </div>
            <span class="margin-left-l">{{ $filters.formatDate(item.createdAt) }}</span>
          </div>
        </app-page>
      </app-view>
    </div>
    <!--<div class="device-page-box valign-center" style="justify-content: center" v-if="!deviceData || deviceData.length <= 0">暂无数据</div>-->
    <div class="page-footer align-center flex">
      <div class="padding-m padding-left-xl padding-right-xl color-primary"
           :class="{ 'flex-item color-white btn-primary': !hasUnread }"
           @click.stop="cancel()">关闭</div>
      <div v-if="entity.totalElements && hasUnread"
           class="flex-item padding-m btn-primary color-white"
           @click.stop="read('','all')">全部标记为已读</div>
    </div>
  </div>
</template>

<script>
  import AppPage from '@/components/layouts/app-page';

  export default {
    name: "order-devicelist",
    data() {
      return {
        // 下拉刷新数据
        pullRefresh: {
          params: {
          },
          events: {
            topMethod: this.getListData,
          }
        },
        // 是否是第一次加载
        isFirst: true,
        // 实体
        entity: {},
        // 消息主体
        notice: {},
        // 是否已读
        isRead: [],
        // 是否有未读消息
        hasUnread: false
      }
    },
    created() {
      // 获取未读消息数量
      this.$http.get(`${this.$apihost}/notify/unread/count`)
      .then((count) => {
        this.hasUnread = Boolean(count);
      })
    },
    computed: {
      page () {
        return {
          url: `${this.$apihost}/notify/page`,
          params: {
            page_size: 10,
            page_sort: 'createdAt_desc',
          },
          storeMutation: '',
          storeGetter: ''
        }
      },
    },
    methods: {
      /**
       * 获取分页数据
       */
      getListData() {
        this.$bus.emit('page-refresh');
      },
      /**
       * 页面加载后操作
       * @param fileList
       */
      onPageLoaded (data) {
        this.$store.commit("hideLoading");
        this.entity = data;
        if(this.isFirst) {
          this.notice = data.content;
          this.isFirst = false;
        } else {
          this.notice = this.notice.concat(data.content);
        }

        // 初始化是否已读
        let _notice = this.notice;
        for(let i = 0,len = _notice.length; i < len; i++) {
          this.isRead[_notice[i].id] = Number(_notice[i].readed);
        }
      },
      /**
       * 取消
       */
      cancel() {
        this.$router.go(-1);
      },
      /**
       * 读取消息
       * @param id
       * @param type
       */
      read(id, type) {
        let that = this;
        let _params = {};
        let _notice = this.notice;
        if(!type) {
          if(!that.isRead[id]) {
            _params = {
              userNotifyIds: id
            }
            that.$http.post(`${that.$apihost}/notify/unread/mark`,_params)
              .then((res) => {
                that.isRead.splice(id,1,--that.isRead[id]);
              })
          }
        } else {
          let _idArr = [];
          for(let i = 0,len = _notice.length; i < len; i++) {
            _idArr.push(_notice[i].id);
          }
          _params = {
            userNotifyIds: _idArr.join(';')
          }
        }
        that.$http.post(`${that.$apihost}/notify/unread/mark`,_params)
          .then((res) => {
            if(type) {
              for(let i = 0,len = _notice.length; i < len; i++) {
                let _id = _notice[i].id;
                if(!that.isRead[_id]) {
                  that.isRead.splice(_id,1,--that.isRead[_id]);
                }
              }
            } else {
              let _id = id;
              if(!that.isRead[_id]) {
                that.isRead.splice(id,1,--that.isRead[_id]);
              }
            }
          })
      }
    },
    components: {
      AppPage,
    }
  }
</script>
