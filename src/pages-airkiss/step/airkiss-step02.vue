<style scoped lang="scss" type="text/scss">

  .airkiss-pages-content {
    margin-bottom: 50px;
  }
  .mint-popup {
    width: 100%;
  }
  .picker-width {
    font-size: 12px !important;
  }
  .selector-header {
    padding: 10px !important;
  }
  .btn-sm {
    font-size: 14px;
  }
  .selector {
    height: 200px;
  }
  .airkiss-useScene,
  .useScenes {
    overflow: hidden;
  }
  .airkiss-useScene {
    width: 100%;
    margin-top: 10px;
  }
  .useScenes-title {
    width: 100px;
    float: left;
  }
  .useScenes {
    width: calc(100% - 101px);
    float: right;
  }
  .useScene {
    display: inline-block;
    padding: 1px 5px;
    margin: 2px 5px;
    border: 1px solid #fff;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    transition: .2s;
  }
  .useSceneSty {
    border: 1px solid #3399ff;
    color: #3399ff;
  }
</style>


<template>
  <div class="bg-white full-height">
    <div class="airkiss-step02">
      <div class="airkiss-pages-top">
        <!--<img :src="$filters.staticImg('/static/images/airkiss/iot-pro.png')"/>-->
        <img src="/static/images/airkiss/iot-pwmap.png"/>
      </div>
      <div class="airkiss-pages-content">

        <div class="airkiss-input">
          <a class="mint-field ripple" v-on:click="isShow = true">
            <div class="mint-cell-wrapper">
              <div class="mint-cell-value">
                <input placeholder="请选择省市区"
                       name="address"
                       type="text"
                       class="mint-field-core"
                       readonly
                       :value="addAddress">
                <i class="fa fa-angle-down font-lighter"></i>
              </div>
            </div>
            <div class="mint-cell-right"></div>
          </a>
          <mt-popup v-model="isShow" position="bottom">
            <div class="selector">
              <!--<mt-picker :slots="addressData" @change="onValueChangeFn" :visible-item-count="3" ></mt-picker>-->
              <div class="selector-header flex">
                <div class="flex-item">
                  <button type="button" class="btn btn-sm" @click="isShow=false">取消</button>
                </div>
                <div class="flex-item align-right">
                  <button type="button" class="btn btn-sm btn-primary" @click="addAddressFn">确定</button>
                </div>
              </div>
              <mt-picker
                :slots="addressData"
                @change="onValueChange">
              </mt-picker>
            </div>
          </mt-popup>
        </div>

        <div class="airkiss-input">
          <input placeholder="请填写详细地址"
                  name="addressDetail"
                  type="text"
                  class="mint-field-core"
                 v-model="addressDetail">
        </div>
        <div class="airkiss-useScene">
          <div class="useScenes-title">使用场景</div>
          <div class="useScenes">
            <div :class="{'useScene': true, 'useSceneSty':scene == list }"
                 v-for="list in useScenes"
                 @click="checkSceneFn">{{list}}</div>
          </div>
        </div>
      </div>

      <button class="airkiss-btn" @click="nextStep">
        <span>下一步</span>
        <i class="iconfont icon-iot-youjiantou1 "></i>
      </button>
    </div>
  </div>
</template>

<script>
  import App from "@/assets/scripts/app";
  import address from '@/assets/scripts/city/cityData.json'

  let Province = Object.keys(address);
  let City = Object.keys(address[Province[0]]);
  let Area = address[Province[0]][City[0]];

  export default {
    name: "airkiss-step02",
    data() {
      return {
        isShow: false,
        address: address,
        checkAddress: '',
        addAddress: '',
        addressDetail: '',
        useScenes: ['客厅', '厨房', '公司', '公寓'],
        scene: '客厅',
        addressData: [
          {
            flex: 1,
            className: 'picker-width',
            textAlign: 'left',
            values: Province,
          },
          {
            flex: 1,
            className: 'picker-width',
            textAlign: 'center',
            values: City,
          },
          {
            flex: 1,
            className: 'picker-width',
            textAlign: 'right',
            values: Area,
          }
        ]
      }
    },

    computed: {
      //获取设备编码
      deviceId: function () {
        return this.$route.params.deviceId;
      }
    },

    //
    mounted(){
      this.loadDeviceDetail(true);
    },

    methods: {
      //下一步
      nextStep: function () {
        const that = this;

        let addAddress = this.addAddress;
        let addressDetail = this.addressDetail;
        if(addAddress && addressDetail) {
          let curUrl = App.accessTokenHost + `/airkiss/step02/` + this.deviceId;
          if(that.$wechat.isInWechat()) {
            that.$wechat.init(curUrl, () => {
              that.$wechat.airkiss((resq) => {
                if(resq === 'configWXDeviceWiFi:ok') {
                  window.location.href = `/airkiss/success`
                } else {
                  window.location.href = `/airkiss/fail`
                }
              })
            })
          } else {
            that.$toast.warn("未知环境需要手动输入");
          }
        } else {
          that.$toast.warn("请完善地址信息");
        }
      },
      //监听地址变化
      onValueChange: function(picker, values) {
        let address = this.address;
        picker.setSlotValues(1, Object.keys(address[values[0]]));
        picker.setSlotValues(2, address[values[0]][values[1]]);
        this.checkAddress = values[0] + ' ' + values[1] + ' ' + values[2];
      },
      //添加地址
      addAddressFn: function() {
        this.addAddress = this.checkAddress;
        this.isShow = false;
      },
      //选择使用场景
      checkSceneFn: function(event) {
        this.scene = event.target.innerText;
      }
    }
  }
</script>
