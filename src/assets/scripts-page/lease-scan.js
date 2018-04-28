/**
 * 扫码租赁业务处理脚本
 *
 * @author  hucw
 * @created 2017-12-27
 */

import Messenger from "@/assets/scripts/messenger";
import Dlg from "@/assets/scripts-component/iotp-dialog";
import Loading from "@/assets/scripts-component/iotp-loading";
import wechat from "@/assets/scripts/wechat";
import alipay from "@/assets/scripts/alipay";

import deviceApi from "@/apis/api-devices";
import userDeviceApi from "@/apis/api-userdevices";
import leaseApi from "@/apis/api-lease";

export default (function (){
  // 扫码结果状态码
  let DeviceQRCodeResultStatus = {
    // 正常设备
    SR_NORMAL: 0,
    // 未授权设备
    SR_UNAUTHZ: 10,
    // 授权中设备
    SR_WAIT_FOR_AUTHZ: 12,
    // 无权设备
    SR_ACCESS_DENIED: 16,
    // 待绑定设备/待激活设备
    SR_UNBIND: 20,

    // 未知设备，提示先配网注册
    SR_NONE_DEVICE: 95,
    // 未知产品配置
    SR_UNKNOWN_PRODUCT: 98,
    // 非法的设备授权码
    SR_ILLEGAL: 99
  };

  // 扫描结果
  let scanResp = {
    scanResult: 0,                 // 参考DeviceQRCodeResult定义
    deviceType: "",                // 设备类型: C(普通设备)|I(智能设备)|L(租赁设备)
    productId: "",                 // 产品ID
    productSpecId: "",             // 产品规格ID
    leaseProductId: "",            // 租赁产品ID
    deviceEntityId: "",            // 设备ID
    userDeviceEntityId: "",        // 用户设备ID
    leaseAction: 0,                // 租赁动作: 0(个人租赁，激活码激活) | 10(扫码租赁，支付激活)
    iotDeviceType: "",             // 智能设备类型: iWater(净水器)|iAir(空净机)
    waterDeviceType: "",           // iWater水机类型： 普通净水机(0) | 加热型净水机(1) | 制冷型净水机(2)
    deviceId: ""
  };

  return {
    /**
     * 扫一扫处理
     *
     * @param curUrl 当前页面URL
     */
    scan: function (curUrl) {
      let that = this;
      Loading.show("正在初始化...");
      if(wechat.isInWechat()) {
        wechat.init(curUrl, function () {
          Loading.hide();

          wechat.scanQRCode(function (resp) {
            that.getDeviceQRCodeResult(resp);
          })
        })
      } else if(alipay.isInAlipay()) {
        alipay.init(function () {
          Loading.hide();

          alipay.scanQRCode(function (resp) {
            that.getDeviceQRCodeResult(resp);
          })
        })
      } else {
        Loading.hide();
      }
    },

    /**
     * 获取设备扫码处理结果
     *
     * @param deviceId 设备ID
     */
    getDeviceQRCodeResult: function (deviceId) {
      deviceApi.getDeviceQRCodeResult(deviceId)
        .then((resp) => {
          scanResp = Object.assign(scanResp, resp, {deviceId: deviceId});
          console.log("扫码结果:" + JSON.stringify(scanResp));
          this._parseQRCodeResult();
        });
    },

    /**
     * 查看设备详情
     */
    viewDevice: function () {
      let viewUrl = "";
      // 普通设备
      if(scanResp.deviceType === "C" || scanResp.iotDeviceType === "") {
        viewUrl = "/devices/" + scanResp.deviceEntityId + "/view";
        window.open(encodeURI(viewUrl), "_self");
        return;
      }

      // 智能设备
      if(scanResp.iotDeviceType === "iWater") {
        /*if(scanResp.waterDeviceType === 1) {
          viewUrl = "/devices/waterdevices/heat/" + scanResp.userDeviceEntityId + "?deviceEntityId=" + scanResp.deviceEntityId;
        } else if(scanResp.waterDeviceType === 2) {
          viewUrl = "/devices/waterdevices/cold/" + scanResp.userDeviceEntityId + "?deviceEntityId=" + scanResp.deviceEntityId;
        } else {
          viewUrl = "/devices/waterdevices/iwater/" + scanResp.userDeviceEntityId + "?deviceEntityId=" + scanResp.deviceEntityId;
        }*/
        viewUrl = "/iot/iwater/" + scanResp.deviceEntityId + "?deviceId="+ scanResp.deviceId +"&userDeviceEntityId=" + scanResp.userDeviceEntityId;
      } else if (scanResp.iotDeviceType === "iAir") {
        viewUrl = "/iot/ifreshair/" + scanResp.deviceEntityId + "?deviceId=" + scanResp.deviceId + "&userDeviceEntityId=" + scanResp.userDeviceEntityId;
      }
      window.open(encodeURI(viewUrl), "_self");
    },

    /**
     * 申请授权使用设备
     */
    applyAuthDevice: function () {
      Dlg.confirm("是否申请授权使用该设备？", function () {
        userDeviceApi.applyAuthDevice(scanResp.deviceId)
          .then(function () {
            Dlg.alert("设备授权申请成功，等待设备拥有者通过授权。");
          });
      })
    },

    /**
     * 绑定智能设备
     */
    bindDevice: function () {
      const that = this;
      Dlg.confirm("是否绑定该设备？", function () {
        userDeviceApi.bindDevice(scanResp.deviceId)
          .then(function (userDevice) {
            Messenger.success("设备绑定成功");
            const device = userDevice.device;
            scanResp.deviceEntityId = device.id;
            scanResp.userDeviceEntityId = userDevice.id;
            scanResp.iotDeviceType = device.iotDeviceType;
            // 设置水机类型
            if(device.iotDevice && device.iotDevice !== null) {
              if(scanResp.iotDeviceType === "iWater") {
                scanResp.waterDeviceType = device.iotDevice.waterDeviceType;
              }
            }
            that.viewDevice();
          })
          .catch((errMsg) => {
            Dlg.alert("抱歉，设备绑定设备。" + errMsg);
          });
      })
    },

    /**
     * 使用激活码激活设备
     */
    activeByCode: function () {
      const that = this;
      this.getActiveCodes(function (activeCode) {
        Dlg.confirm("是否使用激活码：" + activeCode + " 激活设备?", function () {
          Loading.show("正在激活设备");

          leaseApi.activeLeaseDevice(scanResp.deviceEntityId, activeCode)
            .then((resp) => {
              Loading.hide();
              if(resp === true) {
                deviceApi.getDeviceQRCodeResult(deviceId)
                  .then((resp) => {
                    scanResp.deviceType = "L";
                    scanResp.userDeviceEntityId = resp.userDeviceEntityId;
                    that.viewDevice();
                  });
              } else {
                Loading.hide();
                Dlg.alert("抱歉，设备激活失败");
              }
            });
        })
      })
    },

    /**
     * 获取当前用户有效激活码
     * @param callbackFn 回调
     */
    getActiveCodes: function (callbackFn) {
      leaseApi.getAvailableActiveCodes(scanResp.deviceId)
        .then((codes) => {
          if(codes === null || codes.length === 0) {
            Dlg.alert("，请先提交并支付租赁订单");
            Dlg.alert('您还没有激活码哦 <br/> Tips: 提交并支付租赁订单，再重新扫码');
            return;
          }
          if(codes.length === 1) {
            callbackFn && callbackFn.call(this, codes[0]);
          } else {
            // FIXME: 让用户选择激活码
            callbackFn && callbackFn.call(this, codes[0]);
          }
        });
    },

    /**
     * 扫码租赁
     */
    scanLease: function (d) {
      // 跳转扫码租赁选择套餐支付页面
      window.open(encodeURI("/lease/scan/form?deviceEntityId="+ scanResp.deviceEntityId +"&deviceId=" + scanResp.deviceId + "&leaseProductId=" + scanResp.leaseProductId), "_self");
    },

    /**
     * 绑定普通产品信息
     */
    bindCommonDevice: function () {
      window.open(encodeURI("/devices/bind?&deviceId=" + scanResp.deviceId + "&productId=" + scanResp.productId + "&productSpecId=" + scanResp.productSpecId), "_self");
    },

    // ==========================================================================
    // private methods ==========================================================
    _parseQRCodeResult: function () {
      switch (scanResp.scanResult){
        // 正常设备，转入查看页面
        case DeviceQRCodeResultStatus.SR_NORMAL:
          this.viewDevice();
          break;

        // 已绑定用户设备，需要申请授权
        case DeviceQRCodeResultStatus.SR_UNAUTHZ:
          this.applyAuthDevice();
          break;

        // 已申请授权，但拥有者暂未通过授权
        case DeviceQRCodeResultStatus.SR_WAIT_FOR_AUTHZ:
          Dlg.alert("您已提交授权申请，等待设备拥有者通过授权");
          break;

        // 无权限查看该设备
        case DeviceQRCodeResultStatus.SR_ACCESS_DENIED:
          Dlg.alert("抱歉，您无权限查看该设备");
          break;

        // 未绑定设备
        case DeviceQRCodeResultStatus.SR_UNBIND:
          if(scanResp.deviceType === "I") {
            // 智能设备：直接提示绑定
            this.bindDevice();
          } else if(scanResp.deviceType === "L") {
            // 租赁设备：根据租赁流程进行租赁
            if(scanResp.leaseAction === 0) {
              // 个人租赁，激活码激活
              this.activeByCode();
            } else if(scanResp.leaseAction === 10) {
              // 扫码租赁，直接支付激活
              this.scanLease();
            }
          }
          break;

        // 该设备尚未注册
        case DeviceQRCodeResultStatus.SR_NONE_DEVICE:
          // 普通设备转入绑定界面
          if(scanResp.deviceType === "C") {
            this.bindCommonDevice();
          } else {
            Dlg.alert("该设备尚未注册 <br/> Tips: 请使用配网工具进行注册");
          }
          break;

        // 未找到设备所属产品信息
        case DeviceQRCodeResultStatus.SR_UNKNOWN_PRODUCT:
          Dlg.alert("未找到设备所属产品信息 <br/> Tips: 请检查所属产品是否被删除");
          break;

        // 非法授权码
        case DeviceQRCodeResultStatus.SR_ILLEGAL:
          Dlg.alert('非法授权码 <br/> Tips: 请检查二维码是否合法授权');
          break;

        default:
          Dlg.alert("未知扫码结果(result: "+ scanResp.scanResult +"），无法进行处理。");
          break;
      }
    }
  }
} ())

