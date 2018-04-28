/**
 * 智能水机设备API
 *
 * @author  huanglh
 * @created 2018-02-01
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取指定设备的详细数据
   * @param deviceEntityId 设备实体Id
   */
  detail(deviceEntityId) {
    return http.get(this._baseUrl() + deviceEntityId);
  },

  /**
   * 发送开关机指令
   * @param deviceEntityId 设备实体ID
   */
  onoff: function (deviceEntityId) {
    const that = this;
    console.log(deviceEntityId);
    return new Promise((resolved) => {
      http.post(this._baseUrl() + deviceEntityId + "/power")
        .then((instructionId) => {
          that.getInstructionResult(deviceEntityId, instructionId)
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
   * 更新设备的控制状态
   * @param deviceEntityId 设备编码
   * @param itemCode 控制项代码, runMode(运行模式) | inWindSpeed(进风风速) | outWindSpeed(排风风速) | temperature(温度) | humidity(湿度) | auxHeating(辅热) | bypass(旁通)
   * @param params   参数列表，使用;隔开。对于辅热和旁通，0代表关，1代表开
   */
  updateControlState: function (deviceEntityId, itemCode, params = "") {
    const that = this;
    return new Promise((resolved) => {
      http.post(that._baseUrl() + deviceEntityId + "/control/" + itemCode, {
        params: params
      })
        .then((instructionId) => {
          that.getInstructionResult(deviceEntityId, instructionId)
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
   * 获取指令结果
   * @param deviceEntityId 设备实体ID
   * @param instructionId  指令ID
   */
  getInstructionResult: function (deviceEntityId, instructionId) {
    const that = this;
    return new Promise((resolved) => {
      let times = 0;
      let intervalFlag = 0;
      intervalFlag = setInterval(function () {
        if(times >= 15) { // 超时15秒执行失败
          clearInterval(intervalFlag);
          resolved(false);
        }
        times++;

        // 定时每秒获取
        http.get(that._baseUrl() + deviceEntityId + "/instruction/" + instructionId)
          .then((resp) => {
            if(resp.executed === true) {
              clearInterval(intervalFlag);
              resolved(true)
            }
          })
          .catch(() => {
            clearInterval(intervalFlag);
            resolved(false);
          });
      }, 300);
    });
  },

  /**
   * 重置设备滤芯使用时长
   * @param deviceEntityId      设备实体ID
   */
  resetFilter: function (deviceEntityId) {
    return http.post(this._baseUrl() + deviceEntityId + "/filter/reset");
  },

  /**
   * 取消重置设备滤芯使用时长
   * @param deviceEntityId  设备实体ID
   */
  unresetFilter: function (deviceEntityId) {
    return http.post(this._baseUrl() + deviceEntityId + "/filter/unreset");
  },

  /**
   * 查询设备是否在线
   * @param deviceEntityId  设备实体ID
   */
  isOnline: function (deviceEntityId) {
    return http.post(this._baseUrl() + deviceEntityId + "/online");
  },

  /**
   * 执行指令
   * @param deviceEntityId 设备实体ID
   */
  getTimeSettings: function (deviceEntityId) {
    return http.get(this._baseUrl() + deviceEntityId + "/timing")
  },

  /**
   * 执行指令
   * @param deviceEntityId 设备实体ID
   * @param timeId   时间id
   */
  addOrUpdateTime: function (deviceEntityId, timeId, params = "") {
    return http.postJson(this._baseUrl() + deviceEntityId + "/timing/" + timeId, params)
  },

  /**
   * 执行指令
   * @param deviceEntityId 设备实体ID
   * @param timeId   时间id
   */
  deleteTime: function (deviceEntityId, timeId) {
    return http.del(this._baseUrl() + deviceEntityId + "/timing/" + timeId)
  },

  /**
   * 执行指令
   * @param deviceEntityId 设备实体ID
   * @param timeId   时间id
   */
  enableTime: function (deviceEntityId, timeId) {
    return http.post(this._baseUrl() + deviceEntityId + "/timing/" + timeId + '/enable')
  },

  /**
   * 执行指令
   * @param deviceEntityId 设备实体ID
   * @param timeId   时间id
   */
  disableTime: function (deviceEntityId, timeId) {
    return http.post(this._baseUrl() + deviceEntityId + "/timing/" + timeId + '/disable')
  },

  _baseUrl() {
    return App.apihost + "/freshairdevices/";
  },
}
