# simple-page-vue vue单页面开发
---

## 快速开始

``` bash
# 安装依赖，推荐使用淘宝仓库，节省大量时间
npm install --registry=https://registry.npm.taobao.org

# 本地开发，服务端口: 8000
npm run dev

# 生产环境打包，可加参数 --report 输出详细报告
npm run build-release

# 测试环境打包，可加参数 --report 输出详细报告
npm run build-stage
```

> 若使用本地环境开发，请在根目录添加 `local.conf.js` 本地配置文件，内容如下：
>
>   `module.exports = "http://192.168.199.218";`
>
> 请把上面IP地址替换成本机的IP地址，便于手机调试。
>
> 此文件名已添加到gitigore，不用提交到git进行版本管理，避免多人开发造成文件冲突。
>
> 若不添加，系统默认使用 `http://localhost`，但无法在手机上调试。

## API

详见: [http://192.168.199.10:8081/swagger/index.html](http://192.168.199.10:8081/swagger/index.html)

## 开发约定

### 文件夹命名

* 统一小写，禁止大写， _规避跨平台区分大小写导致找不到目录问题_
* 多个单词间 `-` 隔开，禁止驼峰命名，如 `lease-product`
* 业务功能页面文件统一放到 `src/pages` 目录下
* 模块名开头，按模块区分，如 `product`, `lease`

### 文件命名

* 统一小写，禁止大写, _规避跨平台区分大小写导致找不到文件问题_
* 结合文件夹命名，文件命名按模块页面或者按模块功能区分，如`view.js`, `product-form.js`,
* 多个单词间 `-` 隔开，禁止驼峰命名，如 `product-form.js`


### JS规范

请严格遵循ESLint规范进行编码，详细规范参考更目录下文件 `.eslintrc`。

对某个规则若有疑问可提出讨论。


### 模板文件

* 列表视图文件，默认使用 `list` 命名。某些特殊列表视图，使用 `-list` 后缀
* 表单视图文件，默认使用 `form` 命名, 同上特殊视图使用 `-form` 后缀
* 查看视图文件，默认使用 `view` 命名，特殊特殊视图使用 `-view` 后缀


## 目录结构

```bash
app
-- build                      // webpack构建脚本
-- config                     // webpack配置
-- static                     // 静态资源文件夹
-- src
  -- assets
    -- fonts                  // 字体图标
    -- images                 // 图片
    -- scripts                // app通用脚本封装
    -- scss                   // app样式库，包含通用的工具、组件等
  -- compontents              // vue通用组件
  -- paegs                    // 各业务功能页面，按模块区分
  -- store                    // vue状态管理
  -- app.vue                  // app页面入口
  -- main.js                  // vue入口文件
  -- routers.js               // 路由配置
```


## 全局函数(对象)

### $http

网络请求对象，基于`axios`封装，全局挂在Vue.prototype，Vue实例内调用：`this.$http.[method]`。

对请求响应错误拦截，若无特殊需求，默认使用toast提示错误信息。

同时对登录授权拦截，若没有授权token，则自动转到登录页面进行登录。

***methods***

封装了几个常用请求方法，统一返回Promise：

`this.$http.get(url, params)`

`this.$http.post(url, params)`

`this.$http.del(url, params)`

`this.$http.put(url, params)`

> 请求成功直接返回API中的数据体(data)


***demo***

```javascript
this.$http.get("/baseUrl/device/save", {
	name: '设备信息'
})
.then((respData) => {
	console.log(“保存成功”)
})
.catch((error) => {
	// 若非特殊需要，不用捕获异常
	console.log(“异常处理”)
})
```



### $toast

短消息提示函数，全局挂在Vue.prototype，Vue实例内调用：`this.$toast.[method]`，

其中 `method` 支持以下方法：

***methods***

`this.$toast.success(msg)`

`this.$toast. error(msg)`

`this.$toast. warn(msg)`

`this.$toast. info(msg)`

`this.$toast. toast(msg)`


***demo***

```javascript
this.$toast.success('成功消息');

this.$toast.error('错误消息');

this.$toast.toast('类安卓APP底部弹出短消息提示');
```


### $loading

请求遮罩处理，全局挂在Vue.prototype。

***demo***

```javascript
// 显示
this.$loading.show();

// 隐藏
this.$loading.hide();
```


### $wechat

微信对象，全局挂在Vue.prototype。

建议同一组件内多种微信方法放在同一 `init` 内执行或在页面初始化时调用一次,避免多次配置微信对象  

参数以对象的形式传入

其中 `method` 支持以下方法：

***methods***

`this.$wechat.init(_self,_callback)`

`this.$wechat.chooseImage(_count, _sizeType, _sourceType, _callback)`

`this.$wechat.scanQRCode(_needResult, _scanType, _callback)`

`this.$wechat.pay(_timestamp, _nonceStr, _package, _signType, _paySign, _callback)`


***demo***

```javascript
// 初始化配置
this.$wechat.init();


// 选择图片或扫二维码
let that = this;
this.$wechat.init(that,() => {
  if(type === 'chooseImage') {
    that.$wechat.chooseImage({
      count: 1,                               // 默认9
      sizeType: ['original', 'compressed'],   // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],        // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let localIds = res.localIds;          // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      }
    });
  } else if(type === 'scanQRCode') {
    that.$wechat.scanQRCode({
      needResult: 1,
      scanType: ["qrCode","barCode"],
      success: function (res) {
        let _code = res.resultStr;
        console.log('res='+res);
      }
    });
  }
});
```
## 通用组件

### app-view

通用页面视图组件，封装了 加载状态、空白页面、错误提示，以【状态驱动页面】操控不同状态时显示效果。

如何使用：

```html
<app-view>
  <!-- 页面内容 -->
</app-view>
```

***props***:

* `hasFooter`：是否显示底部导航。
* `hasPullRefresh`：是否显示上/下拉刷新。
* `pullRefresh`: 当显示上/下拉刷新时需要传输的配置或回调方法

***slot***:

* `footer`：具名slot，包含在`app-view`组件内部


*状态控制*

* `loading状态`: `this.$store.commit('showLoading', true|false)`
* `empty状态`: `this.$store.commit('showEmptyView', true|false)`

### app-page

无限滚动分页加载组件。

此组件适用于展示分页数据页面，同时需结合后端返回的 `ApiPage` 对象，该组件基于 `ApiPage` 对象属性如 totalElements，fileList等字段进行分页管理。

***demo***


```javascript
<div>
	<app-page :url="page.url" 
            :params="page.params" 
            :storeMutation="page.storeMutation" 
            :storeGetter="page.storeGetter" 
            v-on:loaded="onPageLoaded">
                
	   <!-- 具体列表页面内容布局 -->
		<ul v-if="fileList.length > 0 ">
			<li v-for="item in fileList"></li>
		</ul>

	</app-page>
</div>

<script>
import AppPage from '@/components/layouts/app-page';
import types from "@/store/mutation-types";

export default{
    name: "pageList",
    components: {
      "app-page": AppPage
    },
    data: function () {
      return {
        fileList: []
      }
    },
    computed: {
      page: function () {
        let curShop = this.$store.getters[types.oauth.getCurShop];
        return {
          url: this.$apihost + "/lease/product/page",
          params: {
            shopId: curShop.id
          },
          storeMutation: types.leaseProducts.setPageData,
          storeGetter: types.leaseProducts.getPageData
        }
      }
    },
    methods: {
      onPageLoaded: function (fileList) {
        this.fileList = fileList;
      }
    }
  }
</script>
```

***props***

- `url`: [必须] 获取分页数据的URL
- `params`: [可选] 请求参数, JSON格式
- `storeMutation`: [可选] 用于vuex commit存储分页数据
- `storeGetter`: [可选] 用于vuex获取恢复存储的分页数据

***events***

- `loaded`: 组件加载完毕数据后触发的事件，回传数据数组，在`app-page`中使用`v-on:loaded=""`

## UI组件

### v-input

输入框组件，基于 mint-ui 中 `mt-field` 组件封装，可结合 `vee-validate` 进行表单校验。

***props***

> props 基本和 `mt-field` 提供的保持一致

* `name`: 输入框 name 属性
* `label`: 字段名称
* `value`: 初始化值
* `type`: 输入框类型，如text,number,email等
* `placeholder`: 默认占位内容
* `attr`: 添加自定义属性，必须为json字符串
* `disable`: 是否禁用，true|false
* `readonly`: 是否只读, true|false
* `rows`: 输入框行数，textarea 类型时起效
* `errorMsg`: 校验错误提示语


***demos***

基本使用：

```html
<v-input type="text" name="name" label="姓名" placeholder="请输入姓名" v-model="mobile"></v-input>
<v-input type="tel" name="mobile" label="手机号码" placeholder="请输入手机号" v-model="mobile"></v-input>
```

与 `vee-validate` 结合：

```html
<v-input type="tel" name="mobile" label="手机号码" placeholder="请输入手机号"
         v-model="formData.mobile"
         v-validate="'required|mobile'"
         data-vv-as="手机号码"
         :error-msg="errors.first('mobile')"></v-input>
                      
<v-input type="number" name="smsCode" label="验证码" placeholder="请输入验证码"
         v-model="formData.smsCode"
         v-validate="'required|numeric|min:4|max:4'"
         data-vv-as="验证码"
         :error-msg="errors.first('smsCode')">
    <v-btn-smscode :mobile="formData.mobile" :disabled="canSendCode"></v-btn-smscode>
</v-input>  
```

### v-cell-group

单行文本组，配合v-cell使用。

### v-cell

文本显示组件，主要用于显示字段值。

***props***

- `title`: [必须] 字段名称
- `value`: [可选] 字段值
- `isLink`: [可选] 是否超链接，ture则右侧显示箭头图标


***slot***

- `title`: 字段名称内容∂
- `icon`: 字段名称前面显示的图标

> v-cell中内容没标明具体slot名称则默认为value值显示，同时 props 中value失效。


***demos***

```html
<v-cell isLink="true">
    <span class="font-m" slot="title">我的消息</span>
    <i class="iconfont icon-xiaoxi icon-l margin-right color-primary-light" slot="icon"></i>
</v-cell>
```


## VUE优化

### 第三方库引入

**通用库**

全局通用的库，如vue、vuex等，通过 `<script></script>` 方式在模板文件 `index.html` 或 `index-cdn.html` 中引入。

`vue` 全家桶引入例子：

```html
<!-- 本地开发 index.html 引入本地库 -->
<script src="./static/js/vue/vue.min.js"></script>
<script src="./static/js/vue/vuex.min.js"></script>
<script src="./static/js/vue/vue-router.min.js"></script>

<!-- 服务器部署 index-cdn.html cdn方式引入 -->
<script type="text/javascript" src="https://assets.xohaa.net/assets-h5/static/js/vue/vue.min.js"></script>
<script type="text/javascript" src="https://assets.xohaa.net/assets-h5/static/js/vue/vuex.min.js"></script>
<script type="text/javascript" src="https://assets.xohaa.net/assets-h5/static/js/vue/vue-router.min.js"></script>

<!-- webpack.base.conf.js externals配置 -->
module.exports = { 
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter'
  }
}

<!-- 如何使用? -->
import Vue from "vue";
import Vuex from "vuex";
import Router from 'vue-router';
```

### 静态图片显示

静态图片统一放入：`/static/images` 目录。

页面引入静态图片通过 filter 处理转换为 oss cdn 路径显示，减少服务器网络带宽压力，特别是一些超过100K的图片更需要如此。

**另外，对于一些大图片，必须通过压缩后再放进来。压缩图片工具：[https://tinyjpg.com/](https://tinyjpg.com/)**

例子：

```html
<img :src="$filters.staticImg('/static/images/avatar.png')"/>

// 转换后
<img src="https://assets.xohaa.net/assets-h5/static/images/avatar.png"/>
``` 



