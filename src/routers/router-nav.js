/**
 * 用户端底部导航路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */

export default [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页'
    },
    component: function (resolve) {
      require(['@/pages-member/nav-home'], resolve)
    }
  },
  {
    path: '/devices',
    name: 'devices',
    meta: {
      title: '我的设备'
    },
    component: function (resolve) {
      require(['@/pages-member/nav-devices.vue'], resolve)
    }
  },
  // 租赁
  {
    path: '/lease',
    name: 'lease',
    meta: {
      title: '租赁中心'
    },
    component (resolve) {
      require(['@/pages-member/nav-lease'],resolve)
    }
  },
  {
    path: '/market',
    name: 'market',
    meta: {
      title: '生活馆'
    },
    component: function (resolve) {
      require(['@/pages-member/nav-market.vue'], resolve)
    }
  },
  {
    path: '/my',
    name: 'my',
    meta: {
      title: '我的'
    },
    component: function (resolve) {
      require(['@/pages-member/nav-my.vue'], resolve)
    }
  }
]
