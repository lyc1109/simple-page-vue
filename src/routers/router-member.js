/**
 * 用户个人中心路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */

export default [
  {
    path: '/my/notice',
    name: 'my-notice',
    meta: {
      title: '我的消息'
    },
    component(resolve){
      require(['@/pages-member/person/my-notice.vue'], resolve)
    }
  },
  {
    path: '/my/edit',
    name: 'my-edit',
    meta: {
      title: '修改个人信息'
    },
    component(resolve){
      require(['@/pages-member/person/personal-read.vue'], resolve)
    }
  },
  {
    path: '/my/approval',
    name: 'my-approval',
    meta: {
      title: '设备授权申请'
    },
    component(resolve){
      require(['@/pages-member/person/my-approval.vue'], resolve)
    }
  },
  {
    path: '/my/feedback',
    name: 'my-feedback',
    meta: {
      title: '意见反馈'
    },
    component(resolve){
      require(['@/pages-member/person/my-feedback.vue'], resolve)
    }
  },


  {
    path: '/userdevices/pay/deposit/:id',
    name: 'device-recharge',
    meta: {
      title: '设备充值'
    },
    component (resolve){
      require(['@/pages-member/serviceorder/recharge.vue'],resolve)
    }
  },


  // -----------------------------------
  // 社区模块
  {
    path: '/community/shop_:shopId/index',
    name: 'shop-community',
    meta: {
      title: '社区中心'
    },
    component (resolve){
      require(['@/pages-member/community/index'],resolve)
    }
  },
  //文章详情
  {
    path: '/community/shop_:shopId/article_:id/view',
    name: 'community-detail',
    meta: {
      title: '文章详情'
    },
    component (resolve){
      require(['@/pages-member/community/view'],resolve)
    }
  },
  //发帖
  {
    path: '/community/shop_:shopId/post',
    name: 'community-post',
    meta: {
      title: '文章详情'
    },
    component (resolve){
      require(['@/pages-member/community/post'],resolve)
    }
  },
  // -----------------------------------
  // 水质地图模块
  // 百度地图
  {
    path: '/tdsmap',
    name: 'tdsmap',
    meta: {
      title: '水质地图'
    },
    component (resolve){
      require(['@/pages-member/tdsmap/tdsmap'],resolve)
    },
  },
]
