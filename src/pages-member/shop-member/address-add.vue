<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .add-address{
    .title{
      background: #f0f0f0;

      span{
        color: $primary;
      }
      i{
        float: right;
      }
    }
  }
  .footer{
    .btn:last-child{
      flex: 2;
    }
  }
</style>
<template>
  <app-view :has-footer="true">
    <div class="add-address bg-white">
      <!--<div class="title padding-m">
        <span>{{ titleText }}地址</span>
        <i class="iconfont icon-iot-guanbi font-lighter" @click="cancel()"></i>
      </div>-->
      <div class="add-address-main">
        <div class="contact-name">
          <div class="main padding-left padding-right">
            <v-input v-model.trim="addressInfo.contactName"
                     label="姓名"
                     name="contactName"
                     v-validate="'required'"
                     placeholder="请输入姓名"
                     data-vv-as="姓名"
                     :error-msg="errors.first('contactName')"></v-input>
            <v-input v-model.trim="addressInfo.contactMobile"
                     label="手机号码"
                     name="contactMobile"
                     v-validate="'required|mobile'"
                     data-vv-as="手机号码"
                     :error-msg="errors.first('contactMobile')"
                     placeholder="请输入手机号码"></v-input>
            <v-input v-model.trim="addressInfo.contactTelephone"
                     type="number"
                     label="固定电话"
                     name="contactTel"
                     placeholder="请输入固定电话"></v-input>
          </div>
        </div>
        <div class="address-info">
          <div class="padding-m bg-light"></div>
          <v-selector v-model="addressInfo.province"
                      label="省/直辖市"
                      name="province"
                      placeholder="请选择省/直辖市"
                      v-validate="'required'"
                      data-vv-as="省/直辖市"
                      :error-msg="errors.first('province')"
                      :data="provinceList" @input="provinceChange" :value="value" class="padding-left padding-right"></v-selector>
          <v-selector v-model="addressInfo.city"
                      label="市"
                      name="city"
                      placeholder="请选择市"
                      v-validate="'required'"
                      data-vv-as="市"
                      :error-msg="errors.first('city')"
                      :data="cityList" @input="cityChange" class="padding-left padding-right"></v-selector>
          <v-selector v-model="addressInfo.area"
                      label="区"
                      name="area"
                      placeholder="请选择区"
                      :data="areaList" @input="areaChange" class="padding-left padding-right"></v-selector>
          <v-input v-model.trim="addressInfo.address"
                   label="详细地址"
                   name="detailAddress"
                   v-validate="'required'"
                   data-vv-as="详细地址"
                   :error-msg="errors.first('detailAddress')"
                   placeholder="请输入详细地址" class="padding-left padding-right"></v-input>
          <v-input v-model.trim="addressInfo.zipCode"
                   type="number"
                   label="邮政编码"
                   name="postalCode"
                   placeholder="请输入邮政编码" class="padding-left padding-right"></v-input>
        </div>
      </div>
    </div>
    <div class="footer flex" slot="footer">
      <button class="btn btn-block flex-item" @click="cancel()">取消</button>
      <button type="button" class="btn btn-block btn-primary save flex-item" @click="$route.params.id ? updateAddress() : addAddress()">确定</button>
    </div>
  </app-view>
</template>
<script>
  import VSelector from '@/components/ui/v-selector'
  import address from '@/assets/scripts/city/cityData.json'
  import shopMemberApi from "@/apis/api-shop-member";
  import types from "@/store/types";

    export default {
      name: '',
      data (){
        return {
          provinceVal: '',
          addressInfo: {
            contactName: '',
            contactMobile: '',
            contactTelephone: '',
            province: '',
            city: '',
            area: '',
            address: '',
            zipCode: ''
          },
          provinceData: '省',
          cityData: '市',
          areaData: '区',
          provinceList: Object.keys(address),
          areaList: [],
          cityList: [],
          titleText: '添加新',
          value: ''
        }
      },
      mounted() {
        if(this.$route.params.id) {
          this.updateData()
          this.titleText = '修改'
        } else {
          this.createData()
          this.titleText = '添加新'
        }
      },
      methods: {
        // 当为新增地址时，获取数据
        createData(){
          this.$http.get(`${this.$apihost}/user`)
            .then((res) => {
              this.addressInfo.contactName = res.nickname
              this.addressInfo.contactMobile = res.mobile
              this.addressInfo.province = this.provinceList[0]
            })
        },
        // 当为更新地址时，获取数据
        updateData(){
          this.$http.get(`${this.$apihost}/user/addresses/${this.$route.params.id}`)
            .then((res) => {
              this.addressInfo = res;
            })
        },
        // 添加地址
        addAddress(){
          const that = this;
          this.$validator.validateAll().then((result) => {
            if(result){
              that.$dlg.confirm("确定添加地址？", () => {
                that.$http.post(`${that.$apihost}/user/addresses/add`,{},true,{
                  shopMemberAddressDto: that.addressInfo,
                  contactName: that.addressInfo.contactName,
                  contactMobile: that.addressInfo.contactMobile,
                  contactTelephone: that.addressInfo.contactTelephone,
                  province: that.addressInfo.province,
                  city: that.addressInfo.city,
                  area: that.addressInfo.area,
                  address: that.addressInfo.address
                })
                  .then((res) => {
                    if(res) {
                      shopMemberApi.findAllAddress()
                        .then((data) => {
                          that.$store.commit(types.shopMember.setAddressList, data);
                        });
                      that.$toast.success('添加成功');

                      setTimeout(() => {
                        window.history.go(-1);
                      },500)
                    }
                  })
              });
            }
          })
        },
        // 更新地址
        updateAddress(){
            this.$validator.validateAll().then((result) => {
                if(result){
                  this.$http.post(`${this.$apihost}/user/addresses/${this.$route.params.id}`,{},true,{
                    shopMemberAddressDto: this.addressInfo,
                    contactName: this.addressInfo.contactName,
                    contactMobile: this.addressInfo.contactMobile,
                    contactTelephone: this.addressInfo.contactTelephone,
                    province: this.addressInfo.province,
                    city: this.addressInfo.city,
                    area: this.addressInfo.area,
                    address: this.addressInfo.address
                  })
                    .then((res) => {
                      if(res){
                        this.$messenger.success('更新成功')
                        setTimeout(() => {
                          window.history.go(-1);
//                                this.$router.go(-1);
                        },500)
                      }
                    })
                }
            })
        },
        // 省
        provinceChange(val){
          if(val){
            this.addressInfo.province = val
            this.cityList = Object.keys(address[val])
          }
        },
        // 市
        cityChange(val){
          if(val){
            this.addressInfo.city = val
            let index = this.cityList.indexOf(val)
            this.areaList = address[this.addressInfo.province][this.cityList[index]]
          }
        },
        // 区
        areaChange(val){
          if(val){
            this.addressInfo.area = val
          }
        },
        // 取消
        cancel() {
          window.history.go(-1);
//          this.$router.go(-1);
        }
      },
      components: {
        VSelector
      }
    }
</script>
