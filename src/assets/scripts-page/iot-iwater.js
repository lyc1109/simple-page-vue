/**
 * 智能净水器相关操作封装
 *
 * @author  hucw
 * @created 2018-03-26
 */

import toast from '@/assets/scripts-component/iotp-toast';
import Loading from "@/assets/scripts-component/iotp-loading";
import filters from '@/filters/index';

import iwaterApi from "@/apis/api-iot-waterdevices";

export default {
  /**
   * 执行开关机指令
   * @param deviceEntityId 设备实体ID
   * @param powerOn        是否已开机
   */
  onoff: function (deviceEntityId, powerOn = false) {
    const instructionName = powerOn ? "关机" : "开机";
    Loading.show("正在" + instructionName + "...");
    iwaterApi.executeInstruction(deviceEntityId, "onoff")
      .then((resp) => {
        Loading.hide();
        if(resp){
          toast.success(instructionName + "成功");
        } else {
          toast.error(instructionName + "失败");
        }
      })
  },

  /**
   * 执行重新配网指令
   * @param deviceEntityId 设备实体ID
   */
  restoreWiFi: function (deviceEntityId) {
    Loading.show("正在清除WiFi配置...");
    iwaterApi.executeInstruction(deviceEntityId, "restoreWiFi")
      .then((resp) => {
        Loading.hide();
        if(resp){
          toast.success("请重新配置WiFi");
        } else {
          toast.error("清除WiFi配置失败");
        }
      })
  },

  /**
   * 执行一键冲洗指令
   * @param deviceEntityId 设备实体ID
   */
  flush: function (deviceEntityId) {
    Loading.show("正在冲洗...");
    iwaterApi.executeInstruction(deviceEntityId, "flush")
      .then((resp) => {
        Loading.hide();
        if(resp){
          toast.success("已成功发送冲洗指令");
        } else {
          toast.error("冲洗指令发送失败");
        }
      })
  },


  /**
   * 更新最大出水量
   * @param deviceEntityId
   * @param maxOutFlow
   */
  updateMaxOutFlow: function (deviceEntityId, maxOutFlow) {
    Loading.show();
    iwaterApi.updateMaxOutFlow(deviceEntityId, maxOutFlow)
      .then((resp) => {
        Loading.hide();
        if(resp){
          toast.success("最大出水量已设置成功");
        } else {
          toast.error("最大出水量设置失败");
        }
      })
  },

  /**
   * 重置滤芯
   * @param deviceEntityId 设备实体ID
   * @param filterIndex    滤芯序号
   */
  resetFilter: function (deviceEntityId, filterIndex) {
    return new Promise((resolve) => {
      Loading.show();
      iwaterApi.resetFilter(deviceEntityId, filterIndex)
        .then((resp) => {
          Loading.hide();
          toast.success("滤芯重置成功");
          resolve(resp);
        })
        .catch(() => {
          Loading.hide();
          resolve(null);
          toast.error("滤芯重置失败");
        })
    });
  },

  /**
   * 取消重置滤芯
   * @param deviceEntityId 设备实体ID
   * @param filterIndex    滤芯序号
   */
  unresetFilter: function (deviceEntityId, filterIndex) {
    return new Promise((resolve) => {
      Loading.show();
      iwaterApi.unresetFilter(deviceEntityId, filterIndex)
        .then((resp) => {
          Loading.hide();
          toast.success("滤芯已取消重置");
          resolve(resp);
        })
        .catch(() => {
          Loading.hide();
          resolve(null);
          toast.error("滤芯重置取消失败");
        })
    });
  },

  /**
   * 设置场景温度
   * @param deviceEntityId 设备实体ID
   * @param scenario       出水场景, tea | milk
   * @param temperature    出水温度
   */
  updateTemperature: function (deviceEntityId, scenario, temperature) {
    return new Promise((resolve) => {
      Loading.show();
      iwaterApi.updateTemperature(deviceEntityId, scenario, temperature)
        .then((resp) => {
          Loading.hide();
          if (resp) {
            toast.success("出水温度设置成功");
          } else {
            toast.error("出水温度设置失败");
          }
          resolve(resp);
        });
    });
  },

  /**
   * 更新设备出水温度设置 - 针对冷热型水机
   * @param deviceEntityId     设备实体ID
   * @param temperatureForHot  热水温度
   * @param temperatureForCold 冷水温度
   */
  updateTemperatureEx: function (deviceEntityId, temperatureForHot, temperatureForCold) {
    return new Promise((resolve) => {
      Loading.show();
      iwaterApi.updateTemperatureEx(deviceEntityId, temperatureForHot, temperatureForCold)
        .then((resp) => {
          Loading.hide();
          if (resp) {
            toast.success("出水温度设置成功");
          } else {
            toast.error("出水温度设置失败");
          }
          resolve(resp);
        });
    });
  },

  // 查看授权
  viewAuth: function (router, deviceEntityId) {
    router.push(`/devices/${deviceEntityId}/oauth`)
  },

  /**
   * 创建服务预约订单
   * @param router 路由实例
   * @param device 设备详情
   */
  createServiceOrder: function (router, device) {
    let orderParams = {
      deviceId: device.id,
      deviceEntityId: device.id,
      deviceName: device.deviceName,
      productId: device.productId,
      productImage: device.productImage,
      itemCode: device.itemCode,
      purchasedDate: filters.formatDate(device.purchasedDate),
      address: JSON.stringify(device.address)
    };
    router.push({
      path: "/serviceorder/create",
      query: orderParams
    });
  },

  // 租赁充值续费
  recharge: function (router, device) {
    if(filters.isNullStr(device.company)) {
      let rechargeUrl = "/devices/" + device.id + "/recharge";
      rechargeUrl += "?leaseProductId=" + device.leaseProductId;
      rechargeUrl += "&deviceName=" + device.deviceName;
      rechargeUrl += "&leaseDueDate=" + filters.formatDate(device.leaseDueDate);
      router.push(encodeURI(rechargeUrl));
    } else {
      toast.show("企业租赁请联系商家进行续费。");
    }
  },

  // 查看详情
  viewDetail: function (router, deviceEntityId) {
    router.push("/iot/iwater/" + deviceEntityId + "/detail");
  },

  // 查看滤芯寿命
  viewParts: function (router, deviceEntityId) {
    router.push("/iot/iwater/" + deviceEntityId + "/parts");
  },

  // 查看净水统计
  viewCharts: function (router, deviceEntityId) {
    router.push("/iot/iwater/" + deviceEntityId + "/charts");
  },
}

