/**
 * Vue主入口文件
 */
import Vue from 'vue';
import App from './app.vue';
import router from './routers';
import store from './store';
import MutationTypes from "@/store/types";

// 第三方组件库
// -----------------------------------------------
import MintUI from 'mint-ui';
Vue.use(MintUI);

// Vue事件总线封装：https://github.com/yangmingshan/vue-bus
import VueBus from 'vue-bus';
Vue.use(VueBus);

// Vue表单校验：
import VeeValidate, { Validator } from 'vee-validate';
// 自定义校验扩展
import rules from "@/assets/scripts/vee-validate/rules";
if(rules.length > 0) {
  for(let i=0; i < rules.length; i++) {
    const exrule = rules[i];
    Validator.extend(exrule.name, exrule.rule);
  }
}
Vue.use(VeeValidate, {
  locale: 'zh_CN'
});

// 注册自定义组件
// -----------------------------------------------
import './assets/scss/app.scss';
import AppView from '@/components/layouts/deprecated/app-view.vue';
import VApp from '@/components/layouts/v-app.vue';
import VInput from '@/components/ui/v-input';
import VBtnSmsCode from '@/components/ui/v-btn-smscode';
import VCell from '@/components/ui/v-cell';
import VCellGroup from '@/components/ui/v-cell-group';
import VScript from '@/components/ui/v-script';
Vue.component("app-view", AppView);
Vue.component("v-app", VApp);
Vue.component("v-input", VInput);
Vue.component("v-btn-smscode", VBtnSmsCode);
Vue.component("v-cell", VCell);
Vue.component("v-cell-group", VCellGroup);
Vue.component("v-script", VScript);

// 其它通用配置
// -----------------------------------------------
Vue.config.productionTip = false;

// 注册filter
import filters from './filters/index';
Vue.prototype.$filters = filters;

// api地址配置
import http from './http';
Vue.prototype.$http = http;
// 基本api地址，如 http://api.xohaa.net
Vue.prototype.$basehost = process.env.HOST_BASE;
// 通用api地址，如 http://api.xohaa.net/api/v3
Vue.prototype.$apihost = process.env.API_HOST_BASE;
// 工单专用api地址，如 http://api.xohaa.net/api/v3/wos
Vue.prototype.$woshost = process.env.API_HOST_WOS;

// 通用工具
import AppUtils from "./assets/scripts/app";
Vue.prototype.$app = AppUtils;
// loading
import Loading from "./assets/scripts-component/iotp-loading";
Vue.prototype.$loading = Loading;
// toast
import toast from './assets/scripts-component/iotp-toast';
Vue.prototype.$toast = toast;
// messenger
import messenger from './assets/scripts/messenger';
Vue.prototype.$messenger = messenger;
// utils
import utils from './assets/scripts/utils'
Vue.prototype.$utils = utils;
// wechat
import wechat from './assets/scripts/wechat';
Vue.prototype.$wechat = wechat;
// alipay
import alipay from './assets/scripts/alipay'
Vue.prototype.$alipay = alipay;
// 对话框
import iotpDlg from "./assets/scripts-component/iotp-dialog";
Vue.prototype.$dlg = iotpDlg;

// 路由登录拦截
// -----------------------------------------------
router.beforeEach((to, from, next) => {
  // 默认所有路由都需要授权
  // 例外请在路由中配置： { meta: { requireAuth: true } }
  let requireAuth = to.meta.requireAuth;
  if (typeof (requireAuth) === "undefined") {
    requireAuth = true;
  }

  if (requireAuth === true) {
    // 通过vuex state获取当前的token是否存在
    const token = store.getters[MutationTypes.oauth.getAuthToken];
    if (token !== null && token !== "") {
      next();
    } else {
      // 将跳转的路由path作为参数，登录成功后跳转到该路由
      router.replace({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next();
  }
});

router.afterEach((route) => {
  if(route.meta.title) {
    document.title = route.meta.title;
  }
});


// 异常监控上报: https://fundebug.com/
function formatComponentName(vm) {
  if (vm.$root === vm) {return 'root';}
  const name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
  return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');
}

Vue.config.errorHandler = function(err, vm, info) {
  const componentName = formatComponentName(vm);
  const propsData = vm.$options && vm.$options.propsData;

  // 非开发环境上传错误
  if(App.isProduct || App.isStage || App.isJbrEvn) {
    fundebug.notifyError(err,
      {
        metaData: {
          componentName: componentName,
          propsData: propsData,
          info: info
        },
        filters: [{
          message: /请求异常/
        },{
          res: {
            status: /^401$/
          },
          target: {
            src: /192.168*/
          }
        }]
      });
  } else {
    //alert(" >> "+ componentName +"，"+ err +"，"+ info  +"，"+ JSON.stringify(propsData));
    console.error(" >> "+ componentName);
    console.error(err);
  }
};

// 实例化
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  mounted: function () {
    // 监听错误输出
    this.$bus.on('toast-error', (msg) => {
      this.$loading.hide();
      this.$toast.error(msg);
    });

    // 监听登录处理
    this.$bus.on("oauth", () => {
      router.replace({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}
      })
    });

    //eruda.init();
  },
  beforeDestroy() {
    // 取消事件监听
    this.$bus.off('event-error');
  }
});
