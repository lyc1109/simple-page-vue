/**
 * 租赁相关路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */

export default [
  {
    path: '/lease/product/:id',
    name: 'lease-detail',
    meta: {
      title: '租赁产品详情'
    },
    component (resolve){
      require(['@/pages-member/lease/product/view.vue'],resolve)
    }
  },

  {
    path: '/lease/order/create',
    name: 'lease-order-create',
    meta: {
      title: '提交租赁订单'
    },
    component (resolve){
      require(['@/pages-member/lease/leaseorder/form.vue'],resolve)
    }
  },

  {
    path: '/lease/order/:id/view',
    name: 'lease-order-view',
    meta: {
      title: '查看租赁订单'
    },
    component (resolve){
      require(['@/pages-member/lease/leaseorder/view.vue'],resolve)
    }
  },

  {
    path: '/lease/scan',
    name: 'lease-scan',
    meta: {
      title: '扫码租赁'
    },
    component (resolve){
      require(['@/pages-member/lease/scan/lease-scanner.vue'],resolve)
    }
  },

  // 扫码租赁套餐选择表单
  {
    path: '/lease/scan/form',
    name: 'lease-scan-form',
    meta: {
      title: '扫码租赁'
    },
    component(resolve){
      require(['@/pages-member/lease/scan/lease-scan-form.vue'],resolve)
    }
  },

  // 企业租赁预约表单
  {
    path: '/lease/order/create/business',
    name: 'lease-order-business',
    meta: {
      title: '租赁预约'
    },
    component(resolve){
      require(['@/pages-member/lease/leaseorder/form-business'],resolve)
    }
  }
]
