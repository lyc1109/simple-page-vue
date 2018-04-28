/**
 * 新风系统/空净机路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */

export default [
  // 查看空净机详情
  {
    path: '/iot/ifreshair/:deviceEntityId',
    name: 'ifreshair-view',
    meta: {
      title: '设备详情'
    },
    component: function (resolve) {
      require(['@/pages-member/idevices/iot-ifreshair/view.vue'], resolve)
    }
  },
  {
    path: '/iot/ifreshair/settime/:deviceEntityId',
    name: 'ifreshair-settime-view',
    meta: {
      title: '定时设置'
    },
    component: function (resolve) {
      require(['@/pages-member/idevices/iot-ifreshair/v-set-time-default.vue'], resolve)
    }
  },
]
