/**
 * 订单处理工具类
 *
 * @author  hucw
 * @created 2018-01-02
 */

import moment from 'moment';
import _ from 'loadash';

export default {
  getServiceStartDate: function () {
    const now = moment();
    const after = moment().hour('18').minute('00');
    if(now.isAfter(after)) {
      return now.add(1,'d').toDate();
    } else {
      return new Date();
    }
  },

  getServiceEndDate: function () {
    const end = moment().add(10,'d');
    return end.toDate();
  },

  getServiceDate: function (serviceDate = new Date()) {
    let data = ["09:00~11:00", "11:00~13:00", "13:00~15:00", "15:00~18:00"];
    if (moment(serviceDate).isSame(new Date(), 'd')){
      // 11:00后
      let end = moment().hour('11').minute('00');
      if (moment().isAfter(end)) {
        data = _.reject(data, (n) => n === '09:00~11:00');
      }

      // 13:00后
      end = moment().hour('13').minute('00');
      if (moment().isAfter(end)) {
        data = _.reject(data, (n) => n === '11:00~13:00');
      }

      // 15:00后
      end = moment().hour('15').minute('00');
      if (moment().isAfter(end)) {
        data = _.reject(data, (n) => n === '13:00~15:00');
      }

      // 18:00后
      end = moment().hour('18').minute('00');
      if (moment().isAfter(end)) {
        data = _.reject(data, (n) => n === '15:00~18:00');
      }
    }
    return data;
  }
}
