/**
 * 公告管理
 *
 * @author  hucw
 * @created 2017-06-14
 */
export default [
  {
    path: '/bulletins',
    name: 'bulletins',
    meta: {
      title: '公告列表'
    },
    component: function (resolve) {
      require(['@/pages-member/bulletin/list.vue'], resolve);
    }
  },

  {
    path: '/bulletin/:id',
    name: 'bulletin-view',
    meta: {
      title: '公告详情'
    },
    component: function (resolve) {
      require(['@/pages-member/bulletin/view.vue'], resolve);
    }
  }
]
