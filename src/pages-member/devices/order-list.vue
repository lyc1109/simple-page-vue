<template>
  <div>
    <list-item v-if="orderData && orderData.length" :orderData="orderData" :statusList="statusList"></list-item>
    <div v-else class="flex valign-center align-center bg-white full-height" style="position: fixed;top: 0;bottom: 0;width: 100%;justify-content: center;flex-direction: column;">
      <app-empty-view></app-empty-view>
    </div>
  </div>
</template>
<script>
  import AppEmptyView from '@/components/layouts/app-empty-view';
  import listItem from '../serviceorder/list-item';

  export default {
    name: "order-list",
    data() {
      return {
        // 订单数据
        orderData: {},
        //
        statusList: {}
      }
    },
    created() {
      let that = this;
      this.$http.get(this.$apihost + '/devices/' + this.$route.params.id + '/serviceorders')
      .then((res) => {
        if(res.length) {
          that.orderData = res;
          that.getListData();
        }
      })
      this.$store.commit("hideLoading");
    },
    components: {
      AppEmptyView,
      listItem
    },
    methods: {
      /**
       * 获取列表数据
       */
      getListData() {
        let that = this;
        //获取状态配置数据
        that.$http.get(`${this.$apihost}/serviceorders/const/status`)
          .then((status) => {
            that.statusList = status;
          })
      },
    }
  }
</script>

