/**
 * 厂测工具页面路由配置
 *
 * @author  huanglh
 * @created 2018-01-29
 */
export default [
  {
    path: '/t/factory',
    name: 'factory-test',
    meta: {
      title: '新风系统-厂测工具'
    },
    component: function (resolve) {
      require(['@/pages-factory/index.vue'], resolve);
    }
  },

  // 新风系统/空净机
  {
    path: '/t/ifreshair/:deviceId',
    name: 't-ifreshair-view',
    meta: {
      title: '新风系统-厂测工具',
      requireAuth: false
    },
    component: function (resolve) {
      require(['@/pages-factory/ifreshair/view.vue'], resolve);
    }
  },
]
