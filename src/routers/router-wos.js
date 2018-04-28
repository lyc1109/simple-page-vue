/**
 * 工单系统路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */
export default [
  {
    path: '/wos',
    name: 'wos',
    component: function (resolve) {
      require(['@/pages-wos/wos'], resolve);
    }
  },
  {
    path: '/wos/bind/vendor',
    name: 'wos-bind-vendor',
    meta: {
      title: '绑定手机'
    },
    component: function (resolve) {
      require(['@/pages-wos/bind-vendor'], resolve);
    }
  },
  {
    path: '/wos/index',
    name: 'wos-index',
    meta: {
      title: '首页'
    },
    component: function (resolve) {
      require(['@/pages-wos/index'], resolve);
    }
  },
  {
    path: '/wos/workOrder/:type/list',
    name: 'wos-page',
    meta: {
      title: '全部工单'
    },
    component: function (resolve) {
      require(['@/pages-wos/work-order/list'], resolve);
    }
  },
  {
    path: '/wos/workOrder/:id',
    name: 'wos-view',
    meta: {
      title: '工单详情'
    },
    component: function (resolve) {
      require(['@/pages-wos/work-order/view'], resolve);
    }
  },
  {
    path: '/wos/workOrder/:id/valuation',
    name: 'wos-valuation',
    meta: {
      title: '工单计价'
    },
    component: function (resolve) {
      require(['@/pages-wos/work-order/valuation-page'], resolve);
    }
  },
  {
    path: '/wos/personal/:id/edit',
    name: 'wos-edit',
    meta: {
      title: '个人信息'
    },
    component: function (resolve) {
      require(['@/pages-wos/work-order/personal-edit'], resolve);
    }
  },
  {
    path: '/wos/personal/:id/index',
    name: 'wos-personal',
    meta: {
      title: '个人信息'
    },
    component: function (resolve) {
      require(['@/pages-wos/work-order/personal-read'], resolve);
    }
  },
  {
    path: '/wos/workOrder/:id/valuation/fee',
    name: 'wos-fee',
    meta: {
      title: '费用'
    },
    component: function (resolve) {
      require(['@/pages-wos/work-order/service-page'], resolve);
    }
  }
]
