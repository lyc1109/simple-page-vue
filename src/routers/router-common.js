/**
 * APP通用路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */

export default [
  // 登录处理
  {
    path: '/login',
    name: 'login',
    meta: {
      requireAuth: false
    },
    component: function (resolve) {
      require(['@/components/auth/login.vue'], resolve);
    }
  },
  {
    path: '/logout',
    meta: {
      title: '登出系统'
    },
    redirect: '/login'
  },

  // ===========================
  // 统一支付
  {
    path: '/app/pay',
    name: 'app-pay',
    component: function (resolve) {
      require(['@/components/layouts/app-pay.vue'], resolve);
    }
  },
  {
    path: '/pay/success',
    name: 'pay-success',
    component: function (resolve) {
      require(['@/components/layouts/app-pay-success.vue'], resolve);
    }
  },


  // ===========================
  // 错误页面处理
  {
    path: '*',
    name: '404',
    component: function (resolve) {
      require(['@/components/error/404.vue'], resolve);
    }
  }
]
