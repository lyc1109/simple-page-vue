/**
 * 新风系统/空净机API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取详情数据
   * @param deviceId  设备编码
   */
  detail: function (deviceId) {
    return http.get(this._baseUrl() + deviceId);
  },

  /**
   * 获取原始数据
   * @param deviceId  设备编码
   */
  getDataNodes: function (deviceId) {
    return http.get(this._baseUrl() + deviceId + "/datanodes");
  },

  /**
   * 获取指令结果
   * @param deviceId      设备编码
   * @param instructionId 指令ID
   */
  getInstructionResult: function (deviceId, instructionId) {
    const that = this;
    return new Promise((resolved) => {
      let times = 0;
      let interValFlag = 0;
      interValFlag = setInterval(function () {
        if(times >= 15) { // 超时15秒执行失败
          clearInterval(interValFlag);
          resolved(false);
        }
        times++;

        // 定时每秒获取
        http.get(that._baseUrl() + deviceId + "/instruction/result", {
          instruction_id: instructionId
        })
          .then((resp) => {
            if(resp.executed === true) {
              clearInterval(interValFlag);
              resolved(true)
            }
          })
          .catch(() => {
            clearInterval(interValFlag);
            resolved(false);
          });
      }, 1000);
    });
  },

  /**
   * 更新设备的控制状态
   * @param deviceId 设备编码
   * @param itemCode 控制项代码, runMode(运行模式) | inWindSpeed(进风风速) | outWindSpeed(排风风速) | temperature(温度) | humidity(湿度) | auxHeating(辅热) | bypass(旁通)
   * @param params   参数列表，使用;隔开。对于辅热和旁通，0代表关，1代表开
   */
  updateControlState: function (deviceId, itemCode, params = "") {
    const that = this;
    return new Promise((resolved) => {
      http.post(that._baseUrl() + deviceId + "/control/" + itemCode, {
        params: params
      })
        .then((instructionId) => {
          that.getInstructionResult(deviceId, instructionId)
            .then((resp) => {
              resolved(resp);
            })
        })
        .catch(() => {
          resolved(false);
        });
    });
  },

  /**
   * 更新租赁到期日
   * @param deviceId      设备编码
   * @param lease_duedate 租赁到期日
   */
  updateDuedate: function (deviceId, lease_duedate) {
    return http.post(this._baseUrl() + deviceId + "/duedate", {
      lease_duedate: lease_duedate
    });
  },

  /**
   * 重置设备滤芯使用时长
   * @param deviceId      设备编码
   */
  resetFilter: function (deviceId) {
    return http.post(this._baseUrl() + deviceId + "/filter/reset");
  },

  /**
   * 取消重置设备滤芯使用时长
   * @param deviceId  设备编码
   */
  unresetFilter: function (deviceId) {
    return http.post(this._baseUrl() + deviceId + "/filter/unreset");
  },

  /**
   * 设备开关
   * @param deviceId  设备编码
   */
  onoff: function (deviceId) {
    const that = this;
    return new Promise((resolved) => {
      http.post(that._baseUrl() + deviceId + "/power")
        .then((instructionId) => {
          that.getInstructionResult(deviceId, instructionId)
            .then((resp) => {
              resolved(resp);
            })
        })
        .catch(() => {
          resolved(false);
        });
    });
  },

  /**
   * 是否在线
   * @param deviceId  设备编码
   */
  isOnline: function (deviceId) {
    return http.post(this._baseUrl() + deviceId + "/online");
  },

  _baseUrl: function () {
    return App.apihost + "/test/freshairdevices/";
  }
}
