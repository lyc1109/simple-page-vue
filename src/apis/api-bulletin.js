/**
 * 公告管理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取最新5条公告
   */
  findTop: function () {
    return http.get(App.apihost + "/bulletin/top", {
      bulletin_type: 'H'
    });
  }
}
