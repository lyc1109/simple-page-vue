/**
 * 过滤器定义
 *
 * @author  hucw
 * @created 2017-06-23
 */


import imgFilter from './filter-img';
import datetimeFilter from './filter-datetime';
import numberFilter from './filter-number';
import stringFilter from './filter-string';

let filters = {
  /**
   * 转化字符串为HTML
   *
   * @param html 所要处理的字符串
   */
  unEscape(html) {
    if (typeof html === 'string') {
      return html.replace(/<[^>]+>/g, "")
    }
  }
};
Object.assign(filters, imgFilter);
Object.assign(filters, datetimeFilter);
Object.assign(filters, numberFilter);
Object.assign(filters, stringFilter);

export default filters;
