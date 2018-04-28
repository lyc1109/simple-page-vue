<style scoped lang="scss" type="text/scss">
  @import "~variables";

  li {
    @extend %padding-m;
    @include border(bottom);
    background-color: $white;
  }

  li:last-child {
    border-bottom: none;
  }

  .form-popup {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .flex-right {
    flex: 0 0 rem(30px);
  }

  .selected {
    background-color: rgba($yellow-3, .1);
  }

  .save {
    position: fixed;
    bottom: 0;
    left: 0;
  }
</style>

<template>
  <div>
    <mt-popup class="form-popup" v-model="isShowPopup" position="bottom">
      <div class="form-popup-body">
        <v-spinner v-show="isLoading"></v-spinner>

        <ul v-if="addressList && addressList.length" class="margin-bottom-xxl">
          <li v-for="item in addressList" v-show="addressList.length > 0 "
              @click="selectItem(item)"
              :class="{'ripple': !item.selected, 'ripple selected': item.selected}">

            <div class="flex">
              <div class="flex-item">
                <div class="font-bold margin-bottom">
                  <span class="padding-right">{{item.contactName !== null ? item.contactName : '(未知联系人)'}}</span>
                  <span class="margi-left-l">{{item.contactMobile !== null ? item.contactMobile : '(未知号码)'}}</span>
                </div>
                <span class="font-light">{{ item.fullAddress }}</span>
              </div>

              <div class="flex-right" v-show="item.selected">
                <i class="iconfont icon-iot-gou icon-m font-bold-700 color-success"></i>
              </div>
            </div>
          </li>
        </ul>

        <div v-else-if="!addressList || !addressList.length">
          <app-empty-view :isFullHeight="false"></app-empty-view>
          <p class="align-center">点击下方按钮添加地址哟~</p>
        </div>

        <div class="margin-top align-center">
          <button class="btn btn-link btn-primary-outline" @click="addNewAddress()">
            <i class="fa fa-plus"></i> 添加地址
          </button>
        </div>
      </div>

      <div style="height: 50px"></div>
      <div class="page-footer bg border-top flex" v-show="isShowPopup">
        <button type="button" class="btn btn-block btn-primary" @click="hideAddressSelector()">确定</button>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import VSpinner from "@/components/ui/v-spinner";
  import shopMemberApi from "@/apis/api-shop-member";
  import types from "@/store/types";
  import AppEmptyView from '@/components/layouts/app-empty-view'

  export default {
    name: "address-selector",
    props: {
      // 是否需要返回上一页router
      isBack: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        addressList: [],
        isLoading: false,
         selectedAddress: {}
      }
    },
    computed: {
      isShowPopup: {
        get() {
          return this.$store.getters[types.shopMember.isShowAddressSelector];
        },
        set(value) {
          this.$store.commit(types.shopMember.setShowAddressSelector, value)
        }
      },
    },
    created: function () {
      this.isLoading = true;
      this.addressList = this.$store.getters[types.shopMember.getAddressList];
      if (this.addressList.length === 0) {
        shopMemberApi.findAllAddress()
          .then((data) => {
            this.isLoading = false;
            this.addressList = data;
            this.$store.commit(types.shopMember.setAddressList, data);
            if (this.addressList && this.addressList.length > 0) {
              this.addressList[0].selected = true;
              this.selectItem(this.addressList[0]);
            }
          })
      } else {
        this.isLoading = false;
        this.isBack = false;
        this.selectItem(this.addressList[0]);
      }
    },
    methods: {
      selectItem: function (address) {
        for (let item of this.addressList) {
          item.selected = false;
        }
        address.selected = true;
        this.selectedAddress = address;
        this.$bus.emit("address-selected", address);
        this.$store.commit(types.shopMember.setAddressSelected, address);
        this.$store.commit(types.shopMember.setShowAddressSelector, false);
        /*if (this.isBack === true) {
          this.$router.go(-1);
        }*/
      },

      hideAddressSelector: function () {
        this.selectItem(this.selectedAddress);
      },
      addNewAddress() {
//          this.showAddress = true
        this.$router.push(`/shop/member/address/add`)
      },
    },
    components: {
      VSpinner,
      AppEmptyView
    },
  }
</script>
