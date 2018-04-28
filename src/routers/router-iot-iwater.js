/**
 * 净水机路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */

export default [
  // =============================================================================
  {
    path: '/iot/iwater/:deviceEntityId',
    name: 'iwater-view',
    meta: {
      title: '设备详情'
    },
    component: function (resolve) {
      require(['@/pages-member/idevices/iot-iwater/view.vue'], resolve)
    }
  },
  {
    path: '/iot/iwater/:deviceEntityId/detail',
    name: 'iwater-view-detail',
    meta: {
      title: '设备详情'
    },
    component: function (resolve) {
      require(['@/pages-member/idevices/iot-iwater/view-detail.vue'], resolve)
    }
  },
  {
    path: '/iot/iwater/:deviceEntityId/parts',
    name: 'iwater-view-parts',
    meta: {
      title: '水机滤芯寿命'
    },
    component: function (resolve) {
      require(['@/pages-member/idevices/iot-iwater/view-parts.vue'], resolve)
    }
  },
  {
    path: '/iot/iwater/:deviceEntityId/charts',
    name: 'iwater-view-charts',
    meta: {
      title: '净水统计'
    },
    component: function (resolve) {
      require(['@/pages-member/idevices/iot-iwater/view-charts.vue'], resolve)
    }
  },


  // =============================================================================
  // 旧版路由配置
  //
  //
  //
  //
  // 设备管理
  {
    path: '/devices/:id/view',
    name: 'devices-view',
    meta: {
      title: '设备详细'
    },
    component: function (resolve) {
      require(['@/pages-member/devices/view.vue'], resolve)
    }
  },

  //编辑设备信息
  {
    path: '/devices/:id/edit',
    name: 'devices-edit',
    meta: {
      title: '编辑设备信息'
    },
    component: function (resolve) {
      require(['@/pages-member/devices/edit.vue'], resolve)
    }
  },

  // 设备服务订单
  {
    path: '/devices/:id/orderlist',
    name: 'order-list',
    meta: {
      title: '设备服务订单'
    },
    component: function (resolve) {
      require(['@/pages-member/devices/order-list.vue'], resolve)
    }
  },

  // 设备退租
  {
    path: '/devices/refund',
    name: 'order-list',
    meta: {
      title: '退租订单详情'
    },
    component: function (resolve) {
      require(['@/pages-member/devices/refund.vue'], resolve)
    }
  },

  // 添加设备
  {
    path: '/devices/bind',
    name: 'devices-bind',
    meta: {
      title: '绑定设备'
    },
    component: function (resolve) {
      require(['@/pages-member/devices/bind.vue'], resolve)
    }
  },

  {
    path: '/devices/waterdevices/iwater/:id',
    // path: '/devices/iwater',
    name: 'devices-iwater',
    meta: {
      title: '设备详情'
    },
    component: function (resolve) {
      require(['@/pages-member/devices-iwater/iwater.vue'], resolve)
    }
  },
  {
    path: '/devices/waterdevices/heat/:id',
    // path: '/devices/iwater',
    name: 'devices-iwater',
    meta: {
      title: '设备详情'
    },
    component: function (resolve) {
      require(['@/pages-member/iwater-heat/iwater-heat.vue'], resolve)
    }
  },
  {
    path: '/devices/waterdevices/cold/:id',
    // path: '/devices/iwater',
    name: 'devices-iwater',
    meta: {
      title: '设备详情'
    },
    component: function (resolve) {
      require(['@/pages-member/iwater-cold/iwater-heat.vue'], resolve)
    }
  },
  {
    path: '/devices/:id/iaccount',
    name: 'iwater-statistics',
    meta: {
      title: '净水统计'
    },
    component: function (resolve) {
      require(['@/pages-member/iwater-heat/iwater-statistics.vue'], resolve)
    }
  },
  {
    path: '/devices/:id/ifilter',
    name: 'iwater-filter',
    meta: {
      title: '滤芯寿命'
    },
    component: function (resolve) {
      require(['@/pages-member/iwater-heat/iwater-filter.vue'], resolve)
    }
  },
  {
    path: '/devices/:id/filter',
    name: 'devices-filter',
    meta: {
      title: '滤芯详情'
    },
    component: function (resolve) {
      require(['@/pages-member/devices-iwater/filter.vue'], resolve)
    }
  },
  {
    path: '/devices/:id/oauth',
    name: 'devices-oauth',
    meta: {
      title: '授权管理'
    },
    component: function (resolve) {
      require(['@/pages-member/devices-iwater/oauth.vue'], resolve)
    }
  },

  {
    path: '/devices/:deviceEntityId/recharge',
    name: 'devices-recharge-form',
    meta: {
      title: '租赁设备充值'
    },
    component: function (resolve) {
      require(['@/pages-member/devices/device-recharge-form.vue'], resolve)
    }
  },
  {
    path: '/devices/isettime',
    name: 'devices-filter',
    meta: {
      title: '定时'
    },
    component: function (resolve) {
      require(['@/pages-member/iwater-cold/set-time.vue'], resolve)
    }
  },
]
