/**
 * 厂商入口路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */

export default [
  {
    path: '/shop_:shopId',
    name: 'shop-index',
    component: function (resolve) {
      require(['@/pages-member/index'], resolve)
    }
  },

  {
    path: '/bind/mobile',
    name: 'bind-mobile',
    meta: {
      requireAuth: false
    },
    component: function (resolve) {
      require(['@/pages-member/bind-mobile'], resolve)
    }
  }
]
