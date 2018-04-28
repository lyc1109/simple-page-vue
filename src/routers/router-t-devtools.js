/**
 * 开发工具页面路由配置
 *
 * @author  hucw
 * @created 2017-11-20
 */
export default [
  {
    path: '/t/devtools',
    name: 'devtools',
    meta: {
      title: '开发工具'
    },
    component: function (resolve) {
      require(['@/pages-admin/devtools'], resolve);
    }
  },
  // scan Test
  {
    path: '/scan',
    name: 'scan-test',
    meta: {
      title: '测试扫码'
    },
    component (resolve){
      require(['@/pages-member/nav-scan'],resolve)
    }
  },
]
