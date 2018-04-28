/**
 * 用户个人信息管理
 *
 * @author  hucw
 * @created 2017-06-14
 */

export default [
  // -----------------------------------
  // 地址选择
  {
    path: '/shop/member/address/list/select',
    name: 'address-selector',
    meta: {
      title: '选择地址'
    },
    component: function (resolve) {
      require(['@/pages-member/shop-member/address-selector.vue'], resolve);
    }
  },
  // 地址管理
  {
    path: '/shop/member/address/manage',
    name: 'address-manage',
    meta: {
      title: '管理地址'
    },
    component: function (resolve) {
      require(['@/pages-member/shop-member/address-manage.vue'], resolve);
    }
  },
  {
    path: '/shop/member/address/:id/edit',
    name: 'address-edit',
    meta: {
      title: '编辑地址'
    },
    component: function (resolve) {
      require(['@/pages-member/shop-member/address-add.vue'], resolve);
    }
  },
  {
    path: '/shop/member/address/add',
    name: 'address-add',
    meta: {
      title: '添加地址'
    },
    component: function (resolve) {
      require(['@/pages-member/shop-member/address-add.vue'], resolve);
    }
  }
];
