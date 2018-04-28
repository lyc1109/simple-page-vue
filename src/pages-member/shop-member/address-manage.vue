<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .mint-cell-swipe {
    @extend %padding-m;
    @include border(bottom);
    background-color: $white;
  }

  .mint-cell-swipe:last-child {
    border-bottom: none;
  }
  ul {

    li {
      background-color: $white;

      .flex {
        @include border(bottom);
      }
    }

    li:last-child {
      border-bottom: none;
    }
  }
  .form-popup {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .flex-right{
    flex: 0 0 rem(30px);
  }

  .selected{
    /*background-color: rgba($yellow-3,.1);*/
  }

  .footer-divider{
    height: rem($footer-height);
    @extend %padding;
  }

  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: rem($footer-height);
    z-index: 3000;
    background-color: #fff;

    .btn-block {
      height: rem($footer-height);
      border-radius: 0;
      font-size: $font-size-m;
    }

    .flex-left {
      flex: 0 0 rem(100px);
    }
  }
  .save{
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .flex-item{
    overflow: inherit;
  }
  .mint-radiolist-label{
    display: inline-block;
  }
  .operate{
    position: relative;

    .operate-btn{
      /*position: absolute;*/
      /*right: 0;*/
      /*top: 0;*/
      float: right;

      &>div{
        display: inline-block;
      }
    }
  }
</style>

<template>
  <app-view :has-footer="true">
      <div class="form-popup-body">
        <v-spinner v-show="isLoading"></v-spinner>
        <ul v-if="addressList && addressList.length" class="margin-bottom-xxl">
          <li v-for="item in addressList" :key="item.contactName" v-show="addressList.length > 0 "
              :class="{'ripple': !item.selected, 'ripple selected': item.selected}" class="margin-bottom">

            <div class="padding">
              <div class="font-bold margin-bottom">
                <span class="padding-right">{{item.contactName !== null ? item.contactName : '(未知联系人)'}}</span>
                <span class="margi-left-l">{{item.contactMobile !== null ? item.contactMobile : '(未知号码)'}}</span>
              </div>
              <span class="font-light">{{ item.fullAddress }}</span>
            </div>

            <div class="operate padding bg-white">
              <label class="mint-radiolist-label">
                  <span class="mint-radio">
                    <input type="radio"
                           class="mint-radio-input"
                           name="deviceSelect"
                           :value="item.id"
                           v-model="defaultVal" @click="selectItem(item)">
                    <span class="mint-radio-core"></span>
                    <span class="margin-left-s">{{ item.defaultText }}</span>
                  </span>
              </label>
              <div class="operate-btn">
                <div class="edit-btn" @click="editAddress(item)">
                  <i class="iconfont icon-iot-edit"></i>
                  <span>编辑</span>
                </div>
                <div class="del-btn margin-left" @click="delAddress(item)">
                  <i class="iconfont icon-iot-del"></i>
                  <span>删除</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <app-empty-view v-else :isFullHeight="false"></app-empty-view>
      </div>

    <div class="footer" slot="footer">
      <div class="flex align-center">
        <div class="flex-left padding-top padding-bottom cancel" @click="hideAddressSelector()">
          取消
        </div>
        <div class="flex-item">
          <button type="button" class="btn btn-block btn-primary" @click="addNewAddress()">添加新地址</button>
        </div>
      </div>
    </div>
  </app-view>
</template>

<script>
  import VSpinner from "@/components/ui/v-spinner";
  import shopMemberApi from "@/apis/api-shop-member";
  import types from "@/store/types";
  import AppEmptyView from '@/components/layouts/app-empty-view'

  export default{
    components: {
      VSpinner,
      AppEmptyView
    },
    name: "address-selector",
    data () {
      return {
        addressList: [],
        isLoading: false,
        defaultVal: '',
        defaultArr: []
      }
    },
    created(){
      this.fetchData()
    },
    methods: {
      // 获取地址列表,初始化数据
      fetchData(){
        this.isLoading = true;
        this.addressList = this.$store.getters[types.shopMember.getAddressList];
//        if (this.addressList.length === 0) {
          shopMemberApi.findAllAddress()
            .then((data) => {
              this.isLoading = false;
              this.addressList = data;
              this.$store.commit(types.shopMember.setAddressList, data);
              this.addressList.forEach((value,index,array) => {
                array[index].defaultText = '设为默认'
                if(array[index].defaultAddress === true){
                  this.defaultVal = array[index].id
                  array[index].defaultText = '默认地址'
                }else{
                  array[index].defaultText = '设为默认'
                }
              })
            })
//        } else {
//          this.isLoading = false;
//        }
      },
      // 选择默认地址
      selectItem (address) {
        for(let item of this.addressList) {
          item.defaultVal = address.id;
        }
//        address.id = add;
        this.$bus.emit("address-selected", address);
        this.$store.commit(types.shopMember.setAddressSelected, address);
        this.$store.commit(types.shopMember.setShowAddressSelector, false);
        this.$http.post(`${this.$apihost}/user/addresses/${address.id}/default`)
          .then((res) => {
            if(res){
              this.$messenger.success('设置成功')
              this.isLoading = true;
              this.addressList = this.$store.getters[types.shopMember.getAddressList];
//              if (this.addressList.length === 0) {
                // 刷新地址列表
                shopMemberApi.findAllAddress()
                  .then((data) => {
                    this.isLoading = false;
                    this.addressList = data;
                    this.$store.commit(types.shopMember.setAddressList, data);
                    this.addressList.forEach((value,index,array) => {
                      if(array[index].defaultAddress === true){
                        this.defaultVal = array[index].id
                        array[index].defaultText = '默认地址'
                      }else{
                        array[index].defaultText = '设为默认'
                      }
                    })
                  })
//              } else {
//                this.isLoading = false;
//              }
            }
          })
      },
      hideAddressSelector() {
        window.history.go(-1);
//        this.$router.go(-1);
      },
      // 跳转到新增地址页面
      addNewAddress(){
        window.location.href = `/shop/member/address/add`;
//        this.$router.push(`/shop/member/address/add`)
      },
      // 跳转到更新地址页面
      editAddress(address){
        window.location.href = `/shop/member/address/${address.id}/edit`;
//          this.$router.push(`/shop/member/address/${address.id}/edit`)
      },
      // 删除地址
      delAddress(address){
        const that = this;
        that.$dlg.confirm("确定删除地址?", () => {
          that.$http.del(`${that.$apihost}/user/addresses/${address.id}`)
            .then((res) => {
              if(res){
                that.$toast.success('删除成功');
                that.isLoading = true;
                that.addressList = that.$store.getters[types.shopMember.getAddressList];
                // 刷新地址列表
                shopMemberApi.findAllAddress()
                  .then((data) => {
                    that.isLoading = false;
                    that.addressList = data;
                    that.$store.commit(types.shopMember.setAddressList, data);
                    that.addressList.forEach((value,index,array) => {
                      if(array[index].defaultAddress === true){
                        array[index].selected = true
                      }
                    })
                  })
              }
            })
        });
      }
    }
  }
</script>
