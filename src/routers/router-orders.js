/**
 * 订单管理路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */
export default [

  // --------------------------------------------------------------------
  // 服务订单
  {
    path: '/serviceorder',
    name: 'serviceorder',
    meta: {
      title: '我的订单'
    },
    component(resolve){
      require(['@/pages-member/serviceorder/list.vue'],resolve)
    }
  },
  {
    path: '/serviceorder/create',
    name: 'serviceorder-create',
    meta: {
      title: '提交服务订单'
    },
    component: function (resolve) {
      require(['@/pages-member/serviceorder/form.vue'], resolve)
    }
  },
  {
    path: '/serviceorder/:id/view',
    name: 'serviceorder-view',
    meta: {
      title: '订单详情'
    },
    component: function (resolve) {
      require(['@/pages-member/serviceorder/view.vue'], resolve)
    }
  },
  {
    path: '/serviceorder/:id/evaluate',
    name: 'evaluate',
    meta: {
      title: '订单评价'
    },
    component (resolve){
      require(['@/pages-member/serviceorder/evaluate.vue'],resolve)
    }
  },


  // --------------------------------------------------------------------
  // 销售订单
  {
    path: '/tradeorder/create',
    name: 'tradeorder-create',
    meta: {
      title: '购买商品'
    },
    component: function (resolve) {
      require(['@/pages-member/orders/tradeorder/form.vue'], resolve)
    }
  },
  {
    path: '/tradeorder/:id',
    name: 'tradeorder-view',
    meta: {
      title: '订单详情'
    },
    component: function (resolve) {
      require(['@/pages-member/orders/tradeorder/view.vue'], resolve)
    }
  },
  {
    path: '/tradeorder/:orderEntityId/return-change/logistics',
    name: 'form-defend-logistics',
    meta: {
      title: '添加退换货物流信息'
    },
    component: function (resolve) {
      require(['@/pages-member/orders/tradeorder/form-defend-logistics.vue'], resolve)
    }
  },
]
