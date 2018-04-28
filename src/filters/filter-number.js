/**
 * 数字格式化过滤器
 *
 * @author  hucw
 * @created 2017-12-25
 */

export default {
  /**
   * 格式化人民币
   *
   * @param amount 金额（分）
   */
  formatRMB: function (amount = 0) {
    if(amount <= 0) {
      return "￥0";
    }
    let formatAmount = parseFloat((amount/100.0) + "").toFixed(2);
    return this.formatCurrency(formatAmount, "￥")
  },

  /**
   * 格式化人民币输出
   *
   * @param currency 金额
   * @param symbol   金额符号，默认￥
   */
  formatCurrency: function (currency = "0.00", symbol = "￥") {
    let rmb = "";
    currency = currency + "";
    if (currency.lastIndexOf(".") > 0) {
      let numbers = currency.split(".");
      let digits = numbers[1];

      if (digits.startsWith && digits.startsWith(0)) {
        rmb = parseInt(digits, 10) > 0 ? parseFloat(currency).toFixed(2) : parseInt(currency);
      } else {
        rmb = parseFloat(currency).toFixed(2);
      }
    } else {
      rmb = currency;
    }
    return symbol + rmb;
  },

  /**
   * 转换为整型
   * @param number 数字或小数
   */
  parseInt: function (number) {
    return parseInt(number + "");
  }
}
