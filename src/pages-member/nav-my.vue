<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .header {
    text-align: center;
    box-shadow: none;

    .img-circle {
      border: 4px solid rgba($primary-light, 0.8);
    }
  }

  .v-cell .cell-title {
    font-size: $font-size-l;
  }
  .user-order-box {
    .icon-img {
      color: $primary;
      display: inline-block;
      width: 26px;
      height: auto;
    }

    .user-order-status {
      position: relative;
      width: 70px;
      margin: 0 auto;
      overflow: initial;

      .user-order-badge {
        position: absolute;
        top: -3px;
        right: rem(25px);
        width: rem(15px);
        height: rem(15px);
        text-align: center;
        font-size: $font-size-s;
        color: $white;
        border-radius: rem(25px);
        background-color: $red-2;

        &.more {
          width: initial;
          height: initial;
          padding: rem(0.5px) rem(4px);
        }
      }
    }

    .user-order-all {
      position: relative;
      border-left: 1px dotted rgba($primary,0.5);

      &:before,
      &:after {
        position: absolute;
        top: 40%;
        left: -5px;
        display: block;
        content: "";
        border: 1px dotted rgba($primary,0.5);
        width: 5px;
        height: 5px;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        background: #fff;
      }

      &:after {
        top: 35%;
        left: -21px;
        transform: rotate(0deg);
        border: none;
        width: 20px;
        height: 20px;
      }
    }
  }
</style>

<template>
  <div>
    <app-view class="has-nav">
      <div class="header bg-gradient bg-box padding-xxl" style="background-image: url(/static/images/my/my_bg.png)" @click="edit()">
        <img class="img-circle" :src=" $filters.avatar(curUser.avatar) " v-lazy="$filters.avatar(curUser.avatar)" width="82" height="82"/>
        <div class="color-white font-l font-bold-500 margin-top-s">{{ curUser.nickname }}</div>
      </div>

      <div class="flex align-center bg-white user-order-box padding-top-m padding-bottom-m">
        <div class="flex-item user-order-status"
             v-for="item in orderBtnList"
             :key="item.name"
             @click="order(item)"
             :class="{ 'user-order-all': item.id === '' }">
          <img class="icon-img" :src="$filters.img(item.img, '!q70')" alt="">
          <div class="font-s">{{ item.name }}</div>
          <div v-if="item.num > 0"
               class="user-order-badge font-family-num"
               :class="{ 'more': Number(item.num) >= 10 }">{{ item.num > 99 ? '99+' : item.num }}</div>
        </div>
      </div>

      <div class="margin-top bg-white">
        <div v-if="approval && approval.length > 0">
          <div @click="go('/my/approval')">
            <v-cell class="v-cell-lg" isLink="true">
              <i class="iconfont icon-iot-tongzhi1 margin-right-m color-danger" slot="icon"></i>
              <div slot="title">授权申请</div>
              <div class="font-s color-danger" slot="value">共{{ approval.length }}条记录</div>
            </v-cell>
          </div>
        </div>
        <div @click.stop="$router.push('/shopcart')">
          <v-cell class="v-cell-lg" isLink="true">
            <i class="iconfont icon-iot-shangcheng icon-m margin-right-m color-danger-light"  slot="icon"></i>
            <div slot="title">购物车</div>
            <!--<div slot="value"><span v-if="noticeCount && noticeCount > 1" class="font-s color-white padding-left-s padding-right-s btn-round btn-danger">{{ noticeCount }}条未读</span></div>-->
          </v-cell>
        </div>
        <div @click.stop="myNotice()">
          <v-cell class="v-cell-lg" isLink="true">
            <i class="iconfont icon-iot-wodexiaoxi icon-m margin-right-m color-primary-light" slot="icon"></i>
            <div slot="title">我的消息</div>
            <div slot="value"><span v-if="noticeCount && noticeCount > 1" class="font-s color-white padding-left-s padding-right-s btn-round btn-danger">{{ noticeCount }}条未读</span></div>
          </v-cell>
        </div>
        <!--<v-cell isLink="true">
          <span class="font-default" slot="title">我的优惠券</span>
          <i class="iconfont icon-IOT-yhq icon-m margin-right-m color-orange-2" slot="icon"></i>
        </v-cell>-->
        <div @click.stop="go('/my/feedback')">
          <v-cell class="v-cell-lg" isLink="true">
            <span class="font-default" slot="title">我的建议</span>
            <i class="iconfont icon-IOT-jy icon-m margin-right-m color-primary" slot="icon"></i>
          </v-cell>
        </div>
        <v-cell class="v-cell-lg" isLink="true" @click.native="address()">
          <span class="font-default" slot="title">地址管理</span>
          <i class="iconfont icon-IOT-dz icon-m margin-right-m color-success" slot="icon"></i>
        </v-cell>
        <v-cell class="v-cell-lg" isLink="true" @click.native="customService()">
          <span class="font-default" slot="title">客服中心</span>
          <i class="iconfont icon-iot-kefu icon-m margin-right-m color-warning" slot="icon"></i>
        </v-cell>
        <div @click.stop="help()">
          <v-cell class="v-cell-lg" isLink="true">
            <span class="font-default" slot="title">帮助中心</span>
            <i class="iconfont icon-iot-bangzhuzhongxin2 icon-m margin-right-m color-cyan" slot="icon"></i>
          </v-cell>
        </div>
      </div>
    </app-view>
    <!--<address-selector></address-selector>-->
    <app-nav navId="my" v-if="isShowNav"></app-nav>
  </div>
</template>

<script>
  import AppNav from '@/pages-member/nav';
  import types from "@/store/types";
  import Action from '@/pages-member/tpl/tpl-action'
//  import AddressSelector from "@/pages-member/shop-member/address-selector";

  export default{
    name: "my",
    data(){
      return {
        avatar: '/static/images/avatar.png',
        orderBtnList: [
          {
            name: '待付款',
            img: '/static/images/my/order-unpay.png',
            id: 'dfk',
            badgeShow: true,
            num: 0
          },
          {
            name: '进行中',
            img: '/static/images/my/order-processing.png',
            id: 'jxz',
            badgeShow: true,
            num: 0
          },
          {
            name: '待评价',
            img: '/static/images/my/order-rating.png',
            id: 'dpj',
            badgeShow: true,
            num: 0
          },
          {
            name: '全部订单',
            img: '/static/images/my/order-all.png',
            id: '',
            badgeShow: false
          }
        ],
        // 设备授权申请
        approval: [],
        // 我的消息总数
        noticeCount: 0,
      }
    },
    computed: {
      // 当前用户
      curUser () {
        return this.$store.getters[types.oauth.getCurUser];
      },
      // 当前店铺
      curShop() {
        return this.$store.getters[types.oauth.getCurShop];
      },
      // 是否显示nav
      isShowNav(){
        let query = this.$route.query;
        let nav = query.nav ? query.nav+"" : "true";
        return nav === "true";
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      /**
       * 拉取数据
       */
      fetchData() {
        let _temp = this.orderBtnList;
        // 获取订单数据
        this.$http.get(`${this.$apihost}/serviceorders/dashboard`)
          .then((res) => {
            _temp[0].num = res.tobePaidOrderCount
            _temp[1].num = res.ongoingOrderCount
            _temp[2].num = res.tobeRateOrderCount
          });
        // 获取设备授权数据
        this.$http.get(`${this.$apihost}/userdevices/pending-approvals`)
          .then((data) => {
            this.approval = data;
          });

        // 获取未读消息数量
        this.$http.get(`${this.$apihost}/notify/unread/count`)
          .then((count) => {
            this.noticeCount = count;
          })
      },
      /**
       * 跳转
       * @param _url
       */
      go(_url) {
        this.$utils.loctnHref(_url);
      },
      /**
       * 编辑
       */
      edit() {
        this.$router.push('/my/edit')
      },
      /**
       * 订单列表
       * @param order
       * @returns {boolean}
       */
      order(order) {
        this.$store.commit(types.serviceOrders.setTabVal,order.id);
//        let _params = [
//          {
//            name: 'id',
//            value: order.id
//          }
//        ];
        let _params = {
          id: order.id
        };
        this.$utils.loctnHref('/serviceorder',_params);
//        this.$router.push({
//          path: '/serviceorder',
//          query: {
//            id: order.id
//          }
//        })
      },
      /**
       * 地址管理
       */
      address() {
//        this.$store.commit(types.shopMember.setShowAddressSelector, true)
//        this.$router.push(`/shop/member/address/list/select`)
        this.$router.push('/shop/member/address/manage')
      },
      /**
       * 客服中心
       */
      customService() {
        let _shop = this.curShop;
        if(_shop && _shop.hotline) {
          window.location.href = `tel:${_shop.hotline}`;
        }
      },
      /**
       * 帮助中心
       */
      help() {
        let _host = window.location.host;
        if(_host) {
          if(_host === 'tm.xohaa.net') {
            _host = 'tw.xohaa.net';
          } else if(_host === 'm.xohaa.net') {
            _host = 'www.xohaa.net';
          }
          window.location.href = `http://${_host}/helpcenter/member/${this.curUser.id}`;
        }
      },
      /**
       * 我的消息
       */
      myNotice() {
        if(!this.noticeCount || this.noticeCount.length < 1) {
          this.$toast.show('暂无消息哟~');
        } else {
          this.$router.push(`/my/notice`);
        }
      }
    },
    components: {
      AppNav,
      Action
    },
  }
</script>
