/**
 * 工单系统路由配置
 *
 * @author  huanglh
 * @created 2017-11-20
 */
export default [
  {
    path: '/admin/tools',
    name: 'admin-index',
    meta: {
      title: '品智云管理工具箱'
    },
    component: function (resolve) {
      require(['@/pages-admin/index'], resolve);
    }
  },
  {
    path: '/admin/tools/device/:id/view',
    name: 'admin-device',
    meta: {
      title: '品智云管理-设备详情'
    },
    component: function (resolve) {
      require(['@/pages-admin/device-detail'], resolve);
    }
  },
  {
    path: '/admin/tools/filters/:id/view',
    name: 'admin-filters',
    meta: {
      title: '品智云管理-滤芯详情'
    },
    component: function (resolve) {
      require(['@/pages-admin/filter-info'], resolve);
    }
  },
]
