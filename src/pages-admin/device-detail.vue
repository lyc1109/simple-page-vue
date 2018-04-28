<style scoped lang="scss" type="text/scss">
  @import '../assets/scss/components/_popupwindow';
  @import '~variables';

  .detail-box {
    .item-img {
      width: $xxl;
      height: $xxl;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .item-title {
      width: rem(75px);
    }
  }
  .btn-group-box {
    align-items: flex-start;

    .flex.flex-item {
      flex-direction: column;
    }
    .btn-sm {
      border: 1px solid rgba($primary-light,.5);
      background: $white;
      margin: 0;
      color: $primary-light;
      font-weight: 600;
      width: calc(100% - 22px);
      padding: $xs;
    }
    .danger-btn {
      border: 1px solid rgba($danger, .5);
      background: $white;
      color: $danger;
    }
  }
  .confirm-page {
    width: 100%;
  }
  .popup-page {
    pre {
      font-family: consolas!important;
    }
  }
  .choose-product-popup {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .duedate-box {
    .duedate-datepicker {
      min-height: 0;
      height: 0;
      overflow: hidden;
    }
    .duedate-memo {
      width: 100%;
      .memo-box {
        background: lighten($page_bg,3%);
        position: relative;
        textarea {
          width: 100%;
          border: none;
          background: lighten($page_bg,3%);
          resize: none;
        }
        .text-length {
          position: absolute;
          bottom: rem($xs);
          right: rem($xs);
        }
      }
    }
  }
</style>

<template>
  <div class="bg-white full-height" style="overflow: auto">
    <app-view :hasFooter="false">
      <div class="padding-m align-center font-bold-500 border-bottom bg-gradient color-white">品智云管理工具箱</div>
      <div class="detail-box border-bottom">
        <div v-if="!isIOT" class="padding-m border-bottom flex" style="align-items: flex-start">
          <div class="item-img border border-radius">
            <img v-lazy="$filters.img(entity.productImage,'!wh100')" :src="$filters.img(entity.productImage,'!wh100')" alt="">
          </div>
          <div class="item-info margin-left">
            <div class="font-bold-500 font-m">{{ entity.deviceName ? entity.deviceName : '无设备名称' }}</div>
            <div class="margin-top-s">
              <div class="padding-right-s">设备编号：{{ entity.deviceId ? entity.deviceId : '无' }}</div>
              <div class="padding-top-s">Mac地址：{{ entity.deviceMac ? entity.deviceMac : (entity.iotDevice && entity.iotDevice.deviceMac ? entity.iotDevice.deviceMac : '无') }}</div>
            </div>
          </div>
        </div>
        <div class="device-info margin-left-m">
          <div v-for="(item, index) in entityData"
               class="padding-top padding-bottom padding-right-m border-bottom flex">
            <span class="item-title font-light">{{ item.title }}：</span>
            <div class="flex-item text-wrapper-overline font-bold-500">{{ item.value }}</div>
          </div>
        </div>
      </div>
      <div v-if="!isIOT" class="btn-group-box padding-m flex">
        <div class="flex-item flex">
          <div class="btn-sm align-center border-radius" @click.stop="showJson()">设备详情</div>
          <div class="btn-sm align-center border-radius margin-top" @click.stop="showJson('filters')">查看滤芯详情</div>
          <div class="btn-sm align-center border-radius margin-top" @click.stop="openDuedatePicker()">更新租赁到期日</div>
          <div class="btn-sm align-center border-radius margin-top" @click.stop="editAddress()">重置设备地址</div>
          <div class="btn-sm align-center border-radius margin-top danger-btn" @click.stop="confirmIstr()">执行指令</div>
        </div>
        <div class="flex-item flex">
          <div class="btn-sm align-center border-radius" @click.stop="goIOT()">IOT设备详情</div>
          <div class="btn-sm align-center border-radius margin-top" @click.stop="showJson('iotNow')">IOT设备即时数据</div>
          <div class="btn-sm align-center border-radius margin-top" @click.stop="updateProduct('default')">重置所属产品信息</div>
          <div class="btn-sm align-center border-radius margin-top" @click.stop="updateProduct('lease')">重置所属租赁产品信息</div>
          <div class="btn-sm align-center border-radius margin-top danger-btn" @click.stop="confirmIstr('restore')">重置设备数据</div>
        </div>
      </div>
      <div v-else-if="isIOT" class="btn-group-box padding-m flex">
        <div class="flex-item flex">
          <div class="btn-sm align-center border-radius" @click.stop="showJson('iot')">IOT设备全部数据</div>
          <div class="btn-sm align-center border-radius danger-btn margin-top" @click.stop="confirmIstr()">执行指令</div>
        </div>
        <div class="flex-item flex">
          <div class="btn-sm align-center border-radius" @click.stop="goFilters()">查看滤芯详情</div>
          <div class="btn-sm align-center border-radius danger-btn margin-top" @click.stop="confirmIstr('restore')">重置设备滤芯</div>
        </div>
      </div>

      <!--二次确认-->
      <mt-popup v-model="confirmPopup"
                pop-transition="popup-fade"
                :closeOnClickModal="false"
                class="confirm-page">
        <div style="width: 100%;height: 100%;">
          <div class="mint-msgbox-wrapper" style="position: absolute; z-index: 2003;">
            <div class="mint-msgbox" style="width: 85%!important;">
              <div class="mint-msgbox-header">
                <div v-if="isReset" class="mint-msgbox-title">提示</div>
                <div v-else-if="!isReset" class="mint-msgbox-title">请输入指令代码</div>
              </div>
              <div class="mint-msgbox-content">
                <div v-show="isReset" class="mint-msgbox-message">是否确认重置设备数据？</div>
                <div v-show="!isReset" class="mint-msgbox-input">
                  <input placeholder="请输入指令代码" type="text" ref="codeInput" @keyup="codeCheck()">
                  <div class="mint-msgbox-errormsg" :style="{ 'visibility': !errMsg ? 'hidden' : ''}">{{ errMsg }}</div>
                </div>
              </div>
              <div class="mint-msgbox-btns">
                <button class="mint-msgbox-btn mint-msgbox-cancel " @click.stop="cancelIstr()">取消</button>
                <button class="mint-msgbox-btn mint-msgbox-confirm"
                        :class="{ 'disabled-btn': isTiming && isDoIstr }"
                        @click.stop="istrCode()">
                  <span v-if="isTiming && isDoIstr" class="font-family-num">{{ timeText && timeText > 0 ? '（' + timeText + '）' : '' }}</span>确定</button>
              </div>
            </div>
          </div>
        </div>
      </mt-popup>

      <!--json详情-->
      <mt-popup v-model="jsonPopup" position="right" class="popup-page">
        <div class="popup-box">
          <div class="title padding-m bg-yellow-4 font-default">{{ _jsonTitle }}</div>
          <!--<i class="iconfont icon-iot-guanbi" @click="closeLease()"></i>-->
          <div class="popup-content">
            <div v-if="_json" class="padding-m padding-bottom-xxl">
              <pre class="padding-bottom-xxl" v-html="_json">
                {{ _json }}
              </pre>
            </div>
            <div v-else class="valign-center" style="height: calc(100% - 150px);justify-content: center;flex-direction: column">
              <img src="/static/images/empty/no-list.png" class="tips" style="width: 150px;"/>
              <div>暂无数据~~</div>
            </div>
          </div>
          <div class="close-btn flex">
            <button class="btn btn-block btn-primary padding-m" @click="closePopup()">关闭</button>
          </div>
        </div>
      </mt-popup>

      <!--编辑地址-->
      <edit-address :popup="addressPopup"
                    :deviceId="$route.params.id"
                    @adrsSuccess="adrsSuccess"></edit-address>

      <!--更改所属产品-->
      <mt-popup v-model="productPopup" position="right" class="choose-product-popup">
        <choose-product v-if="productPopup"
                        :deviceId="$route.params.id"
                        :type="productUpdateType"
                        :leaseSet="leaseSet"
                        @prdtSuccess="prdtSuccess"></choose-product>
      </mt-popup>

      <!--更新设备到期日-->
      <div class="duedate-box">
        <v-date-picker class="duedate-datepicker"
                       v-model="dueDate"
                       :startDate="startDate"
                       :endDate="endDate"
                       :defaultVal="dueDate"
                       :callback="openDuedateMemo"></v-date-picker>
        <mt-popup v-model="duedateMemoPopup" position="bottom" class="duedate-memo">
          <div class="popup-box">
            <div class="popup-title bg-yellow-4 padding">更新备注</div>
            <div class="padding-m bg-white">
              <div class="border border-radius padding-s memo-box bg">
                <textarea type="textarea" class="form-field required"
                          name="duedateMemo"
                          rows="4" maxlength="255"
                          placeholder="请填写更新租赁到期日备注"
                          v-model.trim="duedateMemo">
                </textarea>
                <span class="text-length font-light">{{textCount}}/255</span>
              </div>
            </div>
            <div class="popup-window-footer">
              <button type="button" class="btn btn-block padding-m"
                      :class="{ 'disabled-btn': (!textCount || textCount === 0),'btn-primary': (textCount && textCount > 0) }"
                      @click.stop="saveDueDate">确定</button>
            </div>
          </div>
        </mt-popup>
      </div>
    </app-view>
  </div>
</template>
<script>
  import types from "@/store/types";
  import editAddress from './edit-address';
  import chooseProduct from './choose-product';
  import AppEmptyView from '@/components/layouts/app-empty-view';
  import VDatePicker from "@/components/ui/v-date-picker";

  export default {
    name: "admin-device",
    data() {
      return {
        // 设备数据
        entity: {},
        // 设备数据
        deviceData: [],
        // iot数据
        iotData: [],
        // 场景配置
        leaseSet: {},
        // 倒计时数字
        timeText: '',
        // 是否在倒计时
        isTiming: false,
        // 二次确认弹窗
        confirmPopup: false,
        // 错误提示
        errMsg: '',
        // 是否重置设备数据
        isReset: false,
        // 是否执行指令
        isDoIstr: true,
        // json数据
        _json: {},
        // json 弹窗标题
        _jsonTitle: '',
        // 是否显示json
        jsonPopup: false,
        // 地址编辑弹窗
        addressPopup: false,
        // 产品信息选择弹窗
        productPopup: false,
        // 更新的产品类型
        productUpdateType: 'default',
        // 设备到期日
        dueDate: 0,
        // 备注
        duedateMemoPopup: false,
        //
        duedateMemo: ''
      }
    },
    created: function () {
      let that = this;
      that.$loading.show();
      that.$http.get(`${that.$apihost}/devices/${that.$route.params.id}`)
        .then((data) => {
          that.$loading.hide();

          if(data) {
            that.entity = data;
            let _temp = data.iotDevice;
            that.iotData = [
              {
                title: 'MAC地址',
                value: (_temp && _temp.deviceMac) || '无'
              },
              {
                title: 'IP地址',
                value: (_temp && _temp.remoteIp) || '无'
              },
              {
                title: '锁定状态',
                value: (_temp && _temp.locked) ? '已锁定' : '未锁定'
              },
              {
                title: '租赁到期',
                value: (data.leaseDueDate && that.$filters.formatDate(data.leaseDueDate, 'YYYY-MM-DD HH:mm:ss')) || '无'
              },
              {
                title: '激活日期',
                value: (data.activedAt && that.$filters.formatDate(data.activedAt, 'YYYY-MM-DD HH:mm:ss')) || '无'
              },
              {
                title: '最后在线',
                value: (_temp && _temp.lastTouchTime && that.$filters.formatDate(_temp.lastTouchTime, 'YYYY-MM-DD HH:mm:ss')) || '无'
              },
              {
                title: '首次到达',
                value: (_temp && _temp.firstTouchTime && that.$filters.formatDate(_temp.firstTouchTime, 'YYYY-MM-DD HH:mm:ss')) || '无'
              },
              {
                title: '开机状态',
                value: (_temp && _temp.powerOn) ? '开机' : '关机'
              },
              {
                title: '进水TDS',
                value: (_temp && _temp.inWaterTds) || 0
              },
              {
                title: '出水TDS',
                value: (_temp && _temp.outWaterTds) || 0
              },
              {
                title: '总出水量',
                value: `${((_temp && _temp.outValue) || 0)}升`
              },
              {
                title: '滤芯个数',
                value: (_temp && _temp.parts && _temp.parts.length) || 0
              },
              {
                title: '异常代码',
                value: _temp && _temp.exceptionCode
              }
            ];


            let _isCredit = '否';
            if(data && data.leaseProductId) {
              that.$http.get(`${that.$apihost}/lease/products/${data.leaseProductId}/scenario`)
                .then((res) => {
                  that.leaseSet = res;
                  _isCredit = res && res.supportCreditRent ? '是' : '否';
                })
            }
            let _status = '不在线';
            const _now = Date.parse(new Date());
            // 当前时间与最后在线时间小于1分钟则为当前在线
            if(_now - Number(_temp.lastTouchTime) <= 6000) {
              _status = '当前在线';
            }
            that.deviceData = [
              {
                title: '安装地址',
                value: data.address && data.address.fullAddress
              },
              {
                title: '所属店铺',
                value: data.shopId || '无'
              },
              {
                title: '最后在线',
                value: `${(_temp.lastTouchTime ? this.$filters.formatDate(_temp.lastTouchTime, 'YYYY-MM-DD HH:mm:ss') : '无记录')}（${_status}）`
              },
              {
                title: '租赁状态',
                value: data.deviceType === 'L' ? (data.activedAt ? '已租' : '待租') : '非租赁设备'
              },
              {
                title: '租赁用户',
                value: `${(data.lessee && data.lessee.name) || '无'}（${(data.lessee && data.lessee.mobile) || '无'}）`
              },
              {
                title: '租赁时间',
                value: `${(this.$filters.formatDate(data.leaseStartDate) || '无起租日')} ~ ${(this.$filters.formatDate(data.leaseDueDate)  || '无到期日')}`
              },
              {
                title: '配网信息',
                value: data.wifiSsid || '无'
              },
              {
                title: 'IP地址',
                value: (_temp && _temp.remoteIp) || '无'
              },
              {
                title: '租赁单号',
                value: data.leaseOrderId || '无'
              },
              {
                title: '信用免押',
                value: _isCredit
              }
            ];
          }
        })

      if(!window.location.hash) {
        this.jsonPopup = false;
      } else {
        this.jsonPopup = true;
      }
      that.$loading.hide();
    },
    computed: {
      // 当前用户
      curUser() {
        return this.$store.getters[types.oauth.getCurUser];
      },
      isIOT() {
        return (this.$route.query && this.$route.query.isIOT && Boolean(Number(this.$route.query.isIOT))) || false;
      },
      // 显示数据
      entityData() {
        let _temp = [];
        if(this.isIOT) {
          _temp = this.iotData;
        } else {
          _temp = this.deviceData;
        }
        return _temp;
      },
      // 最小可选择日期
      startDate() {
        let _date = moment().startOf('year').subtract('1','years').toDate();
        return _date;
      },
      // 最大日期默认当天
      endDate() {
        const date = moment();
        return date.toDate();
      },
      // 备注字数
      textCount() {
        let that = this;
        let _len = 0;
        let _memo = that.duedateMemo;

        if(_memo && _memo.trim()) {
          _len = _memo.trim().length;
        }

        return Number(_len);
      },
    },
    beforeRouteEnter(to,from,next) {
      if(to.hash) {
        next((vm) => {
          let _hash = to.hash;
          vm.initByHash(_hash);
        })
      } else {
        next();
      }
    },
    mounted() {
      this.$nextTick(() => {
        window.onpopstate = () => {
          let _hash = window.location.hash;
          this.initByHash(_hash);
        }
      })
    },
    methods: {
      /**
       * 根据hash初始化界面
       * @param hash
       */
      initByHash(hash) {
        let that = this;
        let _hash = hash;
        _hash = _hash && _hash.split('#') && _hash.split('#')[1];

        let closeAllPopup = function () {
          that.jsonPopup = false;
          that.addressPopup = false;
          that.productPopup = false;
        }

        closeAllPopup();
        if(_hash) {
          if(_hash === 'address') {
            that.addressPopup = true;
          } else if(_hash === 'popup') {
            that.jsonPopup = true;
          } else if(_hash === 'product') {
            that.productPopup = true;
          }
        }
      },
      /**
       * 倒计时执行方法
       * @param _callback
       * @param _time
       */
      countdown(_callback, _time) {
        let that = this;
        let Timer = null;
        that.isTiming = true;
        let _timeCount = 31;
        if(_time) {
          _timeCount = Number(_time);
        }

        let T = function () {
          if(!that.isDoIstr) {
            clearTimeout(Timer);
            return false;
          }
          if(!that.isTiming) {
            // 回调
            _callback && _callback();
            return false;
          } else {
            if(_timeCount > 1) {
              _timeCount--;
              that.timeText = _timeCount < 10 ? '0' + _timeCount : _timeCount;
            } else {
              that.isTiming = false;
            }
            Timer = setTimeout(T,1000);
          }
        }
        T();
      },
      /**
       * 格式化json
       */
      syntaxHighlight(json) {
        if (typeof json !== 'string') {
          json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
          let cls = 'number text-wrapper-overline';
          let sty = 'color: #a0a';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
              sty = 'color: #c00;font-weight: 700';
            } else {
              cls = 'string text-wrapper-overline';
              sty = 'color: #077;';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
            sty = 'color: #00f;';
          } else if (/null/.test(match)) {
            cls = 'null';
            sty = 'color: #00f;';
          }
          return '<span class="' + cls + '" style="' + sty + '">' + match + '</span>';
        });
      },
      /**
       * 显示json
       * @param type
       */
      showJson(type) {
        let that = this;
        let _type = 'device';
        if(type) {
          _type = type;
        }

        // 处理iot即时数据
        let initIOT = function (_deviceId) {
          that.$http.get(`${that.$apihost}/admin/tools/devices/${_deviceId}/rawdatas`)
            .then((data) => {
//              data = [
//                {
//                  deviceMac: '5CCF7FAA875D',
//                  deviceUdid: '5CCF7FAA875D',
//                  logType: 'O',
//                  rawData: 'EDAF | 00 | 009800000000 | 0280E71E | 5001 | 646464640000 | 00 | 00 | 000064',
//                  remoteIp: '139.207.179.32',
//                  remotePort: 13502,
//                  ts: 1513068182576
//                },
//                {
//                  deviceMac: '5CCF7FAA875D',
//                  deviceUdid: '5CCF7FAA875D',
//                  logType: 'I',
//                  rawData: 'EDAF | 00 | 009800000000 | 0280E71E | 5001 | 646464640000 | 00 | 00 | 000064',
//                  remoteIp: '139.207.179.32',
//                  remotePort: 13502,
//                  ts: 1513068182576
//                }
//              ];
              if(data) {
                let _json = '';
                for(let i = 0,len = data.length; i < len; i++) {
                  let _cur = data[i];
                  _json += `<span class="string text-wrapper-overline" style="color: ${(_cur.logType === 'I' ? 'darkgreen' : 'brown')};">`;
                  _json += `[${_cur.logType}]: ${that.$filters.formatDate(_cur.ts, 'YYYY-MM-DD HH:mm:ss')} (${_cur.remoteIp}:${_cur.remotePort})<br/>${_cur.rawData}`;
                  _json += `</span><br/>`;
                }
                that._json = _json;
              }
              window.location.hash = 'popup';
              that.jsonPopup = true;
            })
        }

        // 获取设备详情
        if(that.entity) {
          let _json = '';
          let _temp = that.entity;
          let _iot = _temp && _temp.iotDevice;

          if(_type !== 'iotNow') {
            if(_type === 'iot') {
              _json = _iot && that.syntaxHighlight(_iot);
              that._jsonTitle = 'IOT设备详情';
            } else if(_type === 'filters') {
              _json = _iot && _iot.parts && that.syntaxHighlight(_iot.parts);
              that._jsonTitle = '滤芯详情';
            } else {
              _json = that.syntaxHighlight(_temp);
              that._jsonTitle = '设备详情';
            }
            that._json = _json;
            window.location.hash = 'popup';
            that.jsonPopup = true;
          } else {
            let _deviceMac = (_iot && _iot.deviceMac) || '';
            if(_deviceMac) {
              initIOT(_deviceMac);
            }
            that._jsonTitle = 'IOT即时数据';
          }
        } else {
          that.$http.get(`${that.$apihost}/devices/${that.$route.params.id}`)
            .then((data) => {
              if(data) {
                let _json = '';
                let _temp = data;
                let _iot = _temp && _temp.iotDevice;

                if(_type !== 'iotNow') {
                  if(_type === 'iot') {
                    _json = _iot && that.syntaxHighlight(_iot);
                  } else if(_type === 'filters') {
                    _json = _iot && _iot.parts && that.syntaxHighlight(_iot.parts);
                  } else {
                    _json = _temp && that.syntaxHighlight(_temp);
                  }
                  that._json = _json;
                  window.location.hash = 'popup';
                  that.jsonPopup = true;
                } else {
                  let _deviceMac = (_iot && _iot.deviceMac) || '';
                  initIOT(_deviceMac);
                }
              }
            })
        }
      },
      /**
       * 关闭弹窗
       */
      closePopup() {
        this.jsonPopup = false;
        this.$router.go(-1);
      },
      /**
       * 二次确认
       * @param _code
       */
      confirmIstr(_code) {
        let that = this;
        if(_code && _code === 'restore') {
          that.isReset = true;
          that.$refs.codeInput.value = _code;
        }
        that.isDoIstr = true;
        that.isTiming = false;
        that.confirmPopup = true;
      },
      /**
       * 指令检验
       */
      codeCheck() {
        let that = this;
        let _value = that.$refs.codeInput.value;
        let _errMsg = '';

        if(_value === null || _value.replace(/^\s+|\s+$/g,"").length === 0){
          _errMsg = "请填写内容";
        }
        that.errMsg = _errMsg;
      },
      /**
       * 执行指令
       * @returns {string}
       */
      istrCode() {
        let that = this;
        let code = that.$refs.codeInput.value;

        if(!code) {
          return false;
        }

        if(!that.isTiming) {
         that.countdown(function() {
           that.$http.post(`${that.$apihost}/waterdevices/${that.entity.id}/instruction/${code}`)
             .then(() => {
               that.$http.get(`${that.$apihost}/waterdevices/${that.entity.id}/instruction/${code}`)
                 .then(() => {
                   that.confirmPopup = false;
                   that.isReset = false;
                   that.isTiming = false;
                   that.$toast.success('执行指令成功!');
                   setTimeout(() => {
                     location.reload();
                   }, 600);
                 })
             })
         });
        }
      },
      /**
       * 取消执行指令
       */
      cancelIstr() {
        let that = this;
        that.confirmPopup = false;
        setTimeout(function () {
          that.isDoIstr = false;
          that.isTiming = false;
          that.isReset = '';
        },500);
      },
      /**
       * IOT设备详情
       */
      goIOT() {
        this.$router.push({
          path: `/admin/tools/device/${this.$route.params.id}/view`,
          query: {
            isIOT: 1
          }
        });
      },
      /**
       * 滤芯详情
       */
      goFilters() {
        this.$router.push(`/admin/tools/filters/${this.$route.params.id}/view`);
      },
      /**
       * 重置设备地址
       */
      editAddress() {
        window.location.hash = 'address';
        this.addressPopup = true;
      },
      /**
       * 重置设备地址后的回调
       * @param _address
       */
      adrsSuccess(_address) {
        let that = this;
        if(_address && JSON.stringify(_address) !== '{}') {
          that.deviceData[0] = {
            title: '安装地址',
            value: _address.province + _address.city + _address.area + _address.address
          }
        }
      },
      /**
       * 更新所属产品类型
       * @param type
       */
      updateProduct(type) {
        if(type) {
          this.productUpdateType = type;
        }
        window.location.hash = 'product';
        this.productPopup = true;
      },
      /**
       * 重置所属产品后的回调
       */
      prdtSuccess() {
        let that = this;
        that.productPopup = false;
        that.$router.go(-1);
        setTimeout(function() {
          that.$router.go(0);
        },500);
      },
      /**
       * 触发租赁到期日选择器
       */
      openDuedatePicker() {
        let dueDate = document.getElementsByClassName('duedate-box');
        dueDate = dueDate && dueDate[0] && dueDate[0].getElementsByClassName('mint-field');
        dueDate = dueDate && dueDate[0];
        dueDate.click();
      },
      /**
       * 打开备注输入框
       */
      openDuedateMemo() {
        this.duedateMemoPopup = true;
      },
      /**
       * 更新租赁到期日
       */
      saveDueDate() {
        let that = this;

        let _params = {
          due_date: this.dueDate,
          memos: that.duedateMemo
        };
        that.$http.post(`${that.$apihost}/admin/tools/lease/devices/${that.$route.params.id}/duedate`, _params)
          .then((res) => {
            if(res) {
              that.$toast.success('操作成功！');
              setTimeout(function() {
                that.$router.go(0);
              },500);
            }
          })
      }
    },
    components: {
      editAddress,
      chooseProduct,
      AppEmptyView,
      VDatePicker
    }
  }
</script>
