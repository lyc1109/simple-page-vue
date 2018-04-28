/**
 * 智能水机设备API
 *
 * @author  huanglh
 * @created 2018-01-18
 */

import App from "scripts/app";
import http from '@/http';

export default (function() {
  // 水机指令集
  let IWaterDeviceInstructions = {
    // 开关机
    onoff: "onoff",
    // 一键冲洗
    flush: "flush",
    // 恢复出厂设置
    restore: "restore",
    // 更新滤芯可用百分比
    updateFilter: "updateFilter",
    // 更新租赁可用时间
    updateLeaseTime: "updateLeaseTime",
    // 更新每次最大出水量
    updateOutflow: "updateOutflow",
    // 更新出水温度
    updateTemperature: "updateTemperature",
    // 重新配网
    restoreWiFi: "restoreWiFi",
  };

  return {

    /**
     * 获取设备详情
     * @param deviceEntityId 设备实体Id
     */
    detail: function(deviceEntityId) {
      return http.get(this._baseUrl() + deviceEntityId);
    },

    /**
     * 获取指定设备的净水明细
     * @param deviceEntityId 设备实体Id
     * @param params         其他参数
     */
    datanodes: function(deviceEntityId, params) {
      let _params = Object.assign({
        page_no: 1,                    // 页面数, 默认从1开始
        page_size: 20,                 // 每页条数, 每页返回最多返回100条, 默认值为20
        page_sort: "",                 // 排序方式, 格式为: 排序字段_排序方向, 如: created_desc
        start_date: "",                // 起始日期(yyyy-MM-dd)
        end_date: "",                  // 结束日期(yyyy-MM-dd)
      }, params);
      return http.get(this._baseUrl() + deviceEntityId + "/datanodes", _params);
    },

    /**
     * 获取指定设备的统计报表数据
     * @param deviceEntityId 设备实体Id
     * @param params         其他参数
     */
    report: function(deviceEntityId, params) {
      let _params = Object.assign({
        report_type: "",               // 统计报表数据日期范围(w/m/y)
        start_date: "",                // 统计报表起始日期(yyyy-MM-dd)
      }, params);
      return http.get(this._baseUrl() + deviceEntityId + "/report", _params);
    },

    /**
     * 更新最大出水量
     * @param deviceEntityId   实体ID
     * @param maxOutFlow       常温水出水量
     * @param maxOutflowForHot 热开水出水量
     */
    updateMaxOutFlow: function (deviceEntityId, maxOutFlow = 120, maxOutflowForHot = 120) {
      return http.post(this._baseUrl() + deviceEntityId + "/max-outflow", {
        max_outflow: maxOutFlow,
        max_outflow_hot: maxOutflowForHot
      })
    },

    /**
     * 重置滤芯
     * @param deviceEntityId 设备实体ID
     * @param filterIndex    滤芯序号
     */
    resetFilter: function (deviceEntityId, filterIndex) {
      return http.post(this._baseUrl() + deviceEntityId + "/resetFilter/" + filterIndex)
    },
    /**
     * 取消重置滤芯
     * @param deviceEntityId 设备实体ID
     * @param filterIndex    滤芯序号
     */
    unresetFilter: function (deviceEntityId, filterIndex) {
      return http.post(this._baseUrl() + deviceEntityId + "/unresetFilter/" + filterIndex)
    },

    /**
     * 设置场景温度
     * @param deviceEntityId 设备实体ID
     * @param scenario       出水场景, tea | milk
     * @param temperature    出水温度
     * @param maxOutFlow     最大出水量
     */
    updateTemperature: function (deviceEntityId, scenario, temperature, maxOutFlow = 150) {
      return http.post(this._baseUrl() + deviceEntityId + "/temperature", {
        scenario: scenario,
        temperature: temperature,
        max_outflow: maxOutFlow
      })
    },

    /**
     * 更新设备出水温度设置 - 针对冷热型水机
     * @param deviceEntityId     设备实体ID
     * @param temperatureForHot  热水温度
     * @param temperatureForCold 冷水温度
     */
    updateTemperatureEx: function (deviceEntityId, temperatureForHot, temperatureForCold) {
      return http.post(this._baseUrl() + deviceEntityId + "/temperature-ex", {
        temperature_hot: temperatureForHot,
        temperature_cold: temperatureForCold
      })
    },

    /**
     * 执行指令
     * @param deviceEntityId 设备实体ID
     * @param instruction    指令，参考IWaterDeviceInstructions
     */
    executeInstruction: function (deviceEntityId, instruction) {
      const that = this;
      return new Promise((resolved) => {
        if(typeof IWaterDeviceInstructions[instruction] === "undefined") {
          resolved(false);
          return;
        }

        http.post(this._baseUrl() + deviceEntityId + "/instruction/" + instruction)
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
     * @param deviceEntityId 设备ID
     * @param instructionId  指令ID
     */
    getInstructionResult: function (deviceEntityId, instructionId) {
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
          http.get(that._baseUrl() + deviceEntityId + "/instruction/" + instructionId)
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

    _baseUrl() {
      return App.apihost + "/waterdevices/";
    },


    //
    // ==========================================================================================
    /**
     * @deprecated
     *
     * 已废弃，请使用executeInstruction()
     *
     * 获取指令执行结果
     * @param deviceEntityId 设备实体Id
     * @param instructionId  所要查询的指令Id
     */
    getInsturct(deviceEntityId, instructionId) {
      return http.get(this._baseUrl() + deviceEntityId + "/instruction/" + instructionId);
    },

    /**
     * @deprecated
     *
     * 已废弃，请使用getInstructionResult()
     *
     * 执行指令
     * @param deviceEntityId 设备实体Id
     * @param instructionId  所要查询的指令Id
     */
    executeInsturct(deviceEntityId, instructionId) {
      return http.post(this._baseUrl() + deviceEntityId + "/instruction/" + instructionId);
    },
  }
}())

