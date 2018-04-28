/**
 * 公众号配网工具页面
 *
 * @author  yangshubo
 * @created 2018-03-20
 */

export default [
  {
    path: '/airkiss',
    name: 'airkiss',
    meta: {
      title: '配网工具'
    },
    component: function (resolve) {
      require(['@/pages-airkiss/index.vue'], resolve)
    }
  },
  {
    path: '/airkiss/step01/:deviceEntityId',
    name: 'airkiss-step01',
    meta: {
      title: '确认设备'
    },
    component: function (resolve) {
      require(['@/pages-airkiss/step/airkiss-step01.vue'], resolve)
    }
  },
  {
    path: '/airkiss/step02/:deviceId',
    name: 'airkiss-step02',
    meta: {
      title: '确认安装地址'
    },
    component: function (resolve) {
      require(['@/pages-airkiss/step/airkiss-step02.vue'], resolve)
    }
  },
  {
    path: '/airkiss/success',
    name: 'airkiss-success',
    meta: {
      title: '配网成功'
    },
    component: function (resolve) {
      require(['@/pages-airkiss/state/airkiss-success.vue'], resolve)
    }
  },
  {
    path: '/airkiss/fail',
    name: 'airkiss-fail',
    meta: {
      title: '配网失败'
    },
    component: function (resolve) {
      require(['@/pages-airkiss/state/airkiss-fail.vue'], resolve)
    }
  }
]
