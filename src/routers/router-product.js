/**
 * 商品路由配置
 *
 * @author  hucw
 * @created 2017-06-14
 */
export default [
  {
    path: '/product/:id',
    name: 'product-view',
    meta: {
      title: '商品详情'
    },
    component: function (resolve) {
      require(['@/pages-member/market/product/view.vue'], resolve)
    }
  },
  {
    path: '/shopcart',
    name: 'shopcart',
    meta: {
      title: '商品详情'
    },
    component: function (resolve) {
      require(['@/pages-member/market/shop-cart/v-shop-cart-view.vue'], resolve)
    }
  }
]
