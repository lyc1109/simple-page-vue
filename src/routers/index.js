import Vue from 'vue';
import Router from 'vue-router';

import commonRoutes from "./router-common";

import shopRoutes from "./router-shop";
import shopEntryRoutes from "./router-shop-entry";

import navRoutes from "./router-nav";
import memberRoutes from "./router-member";
import memberProfile from "./router-member-profile";


// 工单路由
import wosRoutes from "./router-wos";

import adminTools from "./router-t-admin";
import devToolsRouters from './router-t-devtools';
import factoryTestRouter from './router-t-factory';

// 租赁相关
import leaseRouters from './router-lease';
import BulletinRouters from './router-bulletin';

// 智能设备路由
import iwaterRoutes from "./router-iot-iwater";
import ifreshairRoutes from "./router-iot-ifreshair";

//[yangshubo] 微信配网工具airkiss
import airkiss from "./router-airkiss";

// 生活馆
import productRoutes from "./router-product";

// 订单管理路由
import ordersRoutes from "./router-orders";

Vue.use(Router);

// 滚动条行为
// const scrollBehavior = (to, from, savedPosition) => {
//   if (savedPosition) {
//     return savedPosition
//   } else {
//     const position = {};
//
//     /// 滚动到锚点
//     if (to.hash) {
//       position.selector = to.hash
//     }
//
//     // 判断路由配置中是否需要滚动到顶部
//     if (to.matched.some((m) => m.meta.scrollToTop)) {
//       position.x = 0;
//       position.y = 0;
//       console.log(position.x)
//     }
//
//     // 返回false或空对象则不会发生滚动
//     return position
//   }
// };

let routes = [];
routes = routes.concat(commonRoutes);
routes = routes.concat(shopRoutes);
routes = routes.concat(shopEntryRoutes);
routes = routes.concat(navRoutes);
routes = routes.concat(memberRoutes);
routes = routes.concat(iwaterRoutes);
routes = routes.concat(wosRoutes);
routes = routes.concat(memberProfile);

routes = routes.concat(adminTools);
routes = routes.concat(devToolsRouters);
routes = routes.concat(factoryTestRouter);
routes = routes.concat(leaseRouters);
routes = routes.concat(BulletinRouters);
routes = routes.concat(ifreshairRoutes);
routes = routes.concat(productRoutes);
routes = routes.concat(ordersRoutes);

//[yangshubo]
routes = routes.concat(airkiss);

export default new Router({
  mode: 'history',
  // scrollBehavior,
  routes
})
