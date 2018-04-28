<template>
  <div>
    <mt-navbar v-model="serviceOrderValue">
      <mt-tab-item v-for="(item,index) in serviceOrderList" :key="item.id" :id="item.id" @click.native="toggleStatus(item.id)" class="service-order-nav">
        {{ item.label }}
        <span v-if="index < 3">({{ item.num }})</span>
      </mt-tab-item>
    </mt-navbar>
    <app-view :hasPullRefresh="true" :pullRefresh="pullRefresh" class="has-nav">
      <app-page :url="page.url"
                :params="page.params"
                :storeMutation="page.storeMutation"
                :storeGetter="page.storeGetter"
                @loaded="onPageLoaded"
                class="padding-top-xxl">
        <div class="serviceOrder bg">
          <list-item :orderData="serviceOrderData" :statusList="statusList"></list-item>
        </div>
      </app-page>
    </app-view>
  </div>
</template>

<script>
  import AppPage from '@/components/layouts/app-page';
  import types from '@/store/types'
  import AppEmptyView from '@/components/layouts/app-empty-view'
  import listItem from './list-item'

  export default {
    name: "serviceOrder-list",
    components: {
      AppPage,
      AppEmptyView,
      listItem
    },
    data() {
      return {
        // 当前tab值
        serviceOrderValue: '',
        // 订单数据
        serviceOrderData: [],
        // tab数据
        serviceOrderList: [
          {
            id: 'dfk',
            label: '待付款',
            num: 0
          },
          {
            id: 'jxz',
            label: '进行中',
            num: 0
          },
          {
            id: 'dpj',
            label: '待评价',
            num: 0
          },
          {
            id: '',
            label: '全部'
          }
        ],
        // 下拉刷新事件
        pullRefresh: {
          events: {
            topMethod: this.getListData
          }
        },
        pathName: '',
        statusList: {}
      }
    },
    computed: {
      page() {
        return {
          url: this.$apihost + "/serviceorders",
          params: {
            page_size: 10,
            type: this.$route.query.id ? this.$route.query.id : '',
            page_sort: 'created_desc',
          },
          storeMutation: types.serviceOrders.setPageData,
          storeGetter: types.serviceOrders.getPageData
        }
      },
    },
    created() {
      this.serviceOrderValue = this.$route.query.id ? this.$route.query.id : '';
      this.getListData();
      this.orderNum();
    },
    beforeRouteLeave(to,from,next) {
      // 离开页面前解绑事件，避免再次进入时多次请求
      this.$bus.off('page-refresh');
      this.$store.commit(types.serviceOrders.setPageData,null);
      // 记录滚动条位置
      let position = window.scrollY;
      this.$store.commit('saveServiceOrderPosition',position);
      next()
    },
    mounted() {
      this.$nextTick(() => {
        let position = this.$store.state.serviceOrder_position
        window.scroll(0, position);
      })
    },
    methods: {
      /**
       * 获取列表数据
       */
      getListData() {
        let that = this;
        let _params = {
          page_size: 3,
          type: '',
          page_sort: 'created_desc'
        };
        if(this.page && this.page.params) {
          _params = this.page.params;
        }
        this.$store.commit("hideLoading");
        that.$bus.emit('page-refresh', _params);
        //获取状态配置数据
        that.$http.get(`${this.$apihost}/serviceorders/const/status`, null, false)
          .then((status) => {
            that.statusList = status;
          })
      },
      /**
       * 切换页签
       * @param id
       */
      toggleStatus(id) {
        this.$router.replace({
          path: `/serviceorder`,
          query: {
            id: id
          }
        });

        this.getListData();
      },
      /**
       * 订单数量
       */
      orderNum() {
        let _temp = this.serviceOrderList;
        this.$http.get(`${this.$apihost}/serviceorders/dashboard`)
          .then((res) => {
            _temp[0].num = res.tobePaidOrderCount
            _temp[1].num = res.ongoingOrderCount
            _temp[2].num = res.tobeRateOrderCount
          })
      },
      /**
       * 订单列表数据
       * @param fileList
       */
      onPageLoaded(fileList) {
        this.$store.commit("hideLoading");
        this.serviceOrderData = fileList;
      },
    }
  }
</script>
