<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .address-popup {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
<template>
  <div>
    <mt-popup v-show="popup" position="right" class="address-popup">
      <app-view :has-footer="true">
        <div class="address-info bg-white">
          <v-selector v-model="addressInfo.province"
                      label="省/直辖市"
                      name="province"
                      placeholder="请选择省/直辖市"
                      v-validate="'required'"
                      data-vv-as="省/直辖市"
                      :error-msg="errors.first('province')"
                      :data="provinceList" @input="provinceChange" class="padding-left padding-right"></v-selector>
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
        </div>

        <!--<div class="page-footer bg-white flex">-->
          <!--<button type="button" class="btn btn-block flex-item" @click="cancel()">取消</button>-->
          <!--<button type="button" class="btn btn-primary btn-block" id="btnSubmit" @click="selectDevice()">确定</button>-->
        <!--</div>-->

        <div class="page-footer bg-white flex" slot="footer">
          <button type="button" class="btn padding-m padding-top padding-bottom margin-left-zero" style="height: 45px;" @click="cancel()">取消</button>
          <button type="button" class="btn btn-primary padding-m padding-top padding-bottom margin-left-zero flex-item" style="height: 45px;" @click="updateAddress()">确定</button>
        </div>
      </app-view>
    </mt-popup>
  </div>
</template>
<script>
  import VSelector from '@/components/ui/v-selector'
  import address from '@/assets/scripts/city/cityData.json'
  import shopMemberApi from "@/apis/api-shop-member";
  import types from "@/store/types";

  export default {
    name: 'edit-address',
    props: ['popup','deviceId'],
    data () {
      return {
        // 地址信息包
        addressInfo: {
          // 省份
          province: '',
          // 城市
          city: '',
          // 地区
          area: '',
          // 详细地址
          address: '',
        },
        // 省份列表数据
        provinceList: Object.keys(address),
        // 地址列表数据
        areaList: [],
        // 城市列表数据
        cityList: []
      }
    },
    methods: {
      /**
       * 重置地址
       */
      updateAddress() {
        let that = this;
        that.$validator.validateAll().then((result) => {
          if(result) {
            that.$http.post(`${this.$apihost}/devices/${that.deviceId}/address`, that.addressInfo)
              .then((res) => {
                if(res) {
                  that.$toast.success('更新成功');
                  that.$emit('adrsSuccess',that.addressInfo);
                  that.$router.go(-1);
                }
              })
          }
        })
      },
      /**
       * 省份
       * @param val
       */
      provinceChange(val) {
        if(val) {
          this.addressInfo.province = val
          this.cityList = Object.keys(address[val]);
        }
      },
      /**
       * 城市
       * @param val
       */
      cityChange(val) {
        if(val) {
          this.addressInfo.city = val
          let index = this.cityList.indexOf(val)
          this.areaList = address[this.addressInfo.province][this.cityList[index]]
        }
      },
      /**
       * 县区
       * @param val
       */
      areaChange(val) {
        if(val) {
          this.addressInfo.area = val
        }
      },
      /**
       * 取消操作
       */
      cancel() {
        window.history.go(-1);
      }
    },
    components: {
      VSelector
    }
  }
</script>
