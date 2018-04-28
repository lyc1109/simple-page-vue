/**
 * 厂商独立入口路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */
export default [
  {
    path: '/repair',
    name: 'device-repair',
    meta: {
      title: '设备报修'
    },
    component: function (resolve) {
      require(['@/pages-member/repair/device-repair.vue'], resolve)
    }
  },
  {
    path: '/repair/choose',
    name: 'repair-choose',
    meta: {
      title: '选择用户设备'
    },
    component: function (resolve) {
      require(['@/pages-member/repair/choose.vue'], resolve)
    }
  },
  // 选择设备
  {
    path: '/devices/choose',
    name: 'devices-choose',
    meta: {
      title: '选择设备'
    },
    component: function (resolve) {
      require(['@/pages-member/devices/choose.vue'], resolve)
    }
  }
]
