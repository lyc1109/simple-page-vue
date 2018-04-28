<style scoped lang="scss" type="text/scss">
  @import '~variables';

  /*.btn-box {*/
  .btn-round {
    @include border-radius(20px);
    border: rem(1px) solid $font-lighter;
    width: auto !important;
    &:last-child {
      background: $primary;
      background-color: $primary;
      color: $white;
      @include border(all, $primary);
    }
  }

  /*}*/
</style>
<template>
  <div>
    <!--订单操作-->
    <div v-if="order">
      <button v-if="type === 'view'"
              type="button"
              class="btn btn-sm btn-round"
              @click="back()">返回
      </button>
      <button
        v-if="order.status < 70 && type === 'view' && (order.orderType === 'business' || (order.orderType === 'lease' && order.leaseFeature !== 'company'))"
        type="button"
        class="btn btn-sm btn-round"
        @click="cancelOrder(order)">取消订单
      </button>
      <button v-if="order.status < 60 && type === 'view' && order.orderType === 'common' && !order.payment"
              type="button"
              class="btn btn-sm btn-round"
              @click="cancelOrder(order)">取消订单
      </button>
      <button v-if="order.status === 70"
              type="button"
              class="btn btn-sm btn-round"
              :class="{ 'btn-primary': type === 'list','btn-primary-outline': type === 'view','btn-sm': type === 'view' }"
              @click.stop="$router.push({ path: `/serviceorder/${order.id}/evaluate`,query: orderItem })">去评价
      </button>
      <button v-if="order.status <= 60 && !order.deviceEntityId && order.orderType === 'lease' && !order.paidTime"
              type="button"
              class="btn btn-sm btn-round"
              :class="{ 'btn-primary': type === 'list','btn-primary-outline': type === 'view','btn-sm': type === 'view' }"
              @click="toPay()">支付订单
      </button>
    </div>
    <div v-if="type === 'oauth'">
      <button class="btn btn-sm btn-round margin-left-m" @click.stop="reject(order.id)">拒绝</button>
      <button class="btn btn-sm btn-round" @click.stop="approve(order.id)">同意</button>
    </div>
  </div>
</template>
<script>
  import types from '@/store/types';
  import ServiceOrderApi from '@/apis/api-serviceorder';

  export default {
    name: 'member-action',
    props: ['order', 'type', 'isBack', 'deviceData', 'backPath'],
    data() {
      return {
        cancelBtn: true
      }
    },
    computed: {
      // 当前订单数据
      orderItem() {
        let _temp = this.order;
        let _data = {
          id: _temp.id,
          productImage: _temp.productImage,
          productName: _temp.productName,
          shopServiceName: _temp.shopServiceName,
          orderId: _temp.orderId,
          assignee: _temp.assignee,
        }
        return {
          order: encodeURIComponent(JSON.stringify(_data))
        }
      }
    },
    methods: {
      // 取消订单
      cancelOrder(order) {
        let that = this;
        let options = {
          showInput: true,
          showCancelButton: true,
          inputPlaceholder: "请填写取消原因",
          inputValidator(value) {
            if (value === null || value.replace(/^\s+|\s+$/g, "").length === 0) {
              return "请填写内容";
            }
          }
        };
        this.$dlg.prompt("请填写取消原因", function (value) {
          that.$http.post(`${that.$apihost}/serviceorders/${order.id}/cancel`, {
            cancel_info: value
          })
            .then((res) => {
              if (res) {
                that.$messenger.success('取消成功');
                setTimeout(() => {
                  that.$store.state.refresh = true;
                  that.$router.push('/serviceorder');
                }, 1000)
              }
            })
        });
      },
      /**
       * 返回
       */
      back() {
        let that = this;
        if (that.order) {
          if (that.isBack) {
            that.$router.go(-1);
          } else {
            that.$router.push({path: '/serviceorder', query: {id: ''}});
          }
        } else if (that.deviceData) {
          if (that.backPath === 'bindPath') {
            that.$router.push('/devices');
          } else {
            that.$router.go(-1);
          }
        }
      },
      /**
       * 编辑设备信息
       */
      editDevice(id) {
        this.$router.push(`/devices/${id}/edit`);
      },
      /**
       * 一键报修
       */
      repair(device) {
        let that = this;
        let _temp = device;
        if (_temp) {
          that.$router.push({
            path: `/serviceorder/create`,
            query: {
              id: _temp.id,
              deviceId: _temp.deviceId,
              deviceName: _temp.deviceName,
              productId: _temp.productId,
              productImage: _temp.productImage,
              itemCode: _temp.itemCode,
              purchasedDate: that.$filters.formatDate(_temp.purchasedDate),
              address: _temp.address && encodeURIComponent(JSON.stringify(_temp.address))
            }
          });
        }
      },
      /**
       * 支付押金
       */
      toPay() {
        const order = this.order;
        if (order === null) {
          this.$dlg.alert("订单信息为空，无法进行支付。");
          return;
        }

        // 获取订单费用
        this.$loading.show();
        ServiceOrderApi.fees(order.id)
          .then((feeItems) => {
            this.$loading.hide();

            let fees = [];
            for(let item of feeItems) {
              if(item.feeType === "YJ") {
                fees.push({
                  name: "押金",
                  amount: item.subTotal
                })
              } else if(item.feeType === "ZJ") {
                fees.push({
                  name: "租金",
                  amount: item.subTotal
                })
              } else {
                fees.push({
                  name: item.feeDefName,
                  amount: item.subTotal
                })
              }
            }

            // 转到支付界面
            const payInfo = {
              type: "order",
              payTitle: order.orderId,
              totalAmount: order.payment,
              fees: fees,
              orderInfo: {
                orderEntityId: order.id
              }
            };
            this.$store.commit(types.appPay.setPayInfo, payInfo);
            //this.$router.push("/app/pay");
            window.location.href = "/app/pay";
          });
      },

      /**
       * 同意授权
       * @param id
       */
      approve(id) {
        let that = this;
        this.$http.post(`${this.$apihost}/userdevices/${id}/approve-authorization`)
          .then((res) => {
            that.$toast.success('授权成功！');
            setTimeout(function () {
              that.$router.go(0);
            }, 500);
          })
      },
      /**
       * 拒绝授权申请
       * @param id
       */
      reject(id) {
        let that = this;
        this.$http.post(`${this.$apihost}/userdevices/${id}/reject-authorization`)
          .then((res) => {
            that.$toast.success('已拒绝授权申请！');
            setTimeout(function () {
              that.$router.go(0);
            }, 500);
          })
      }
    },
  }
</script>
