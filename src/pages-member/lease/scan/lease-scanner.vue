<!-- 扫码租赁 -->
<template>
  <div class="full-height valign-center" style="background: #F8F6F2">
    <div class="align-center full-width">
      <h2>租赁设备</h2>
      <h4>请扫描设备上的二维码进行充值支付</h4>

      <img :src="$filters.staticImg('/static/images/empty/no-device.png', '/resize,w_300,h_300')"/>

      <div class="padding-top-m">
        <button type="button" class="btn btn-primary btn-lg btn-round" @click="scanQRCode()">点我扫一扫</button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import App from "@/assets/scripts/app";
  import scanHandler from "@/assets/scripts-page/lease-scan";

  export default {
    name: 'lease-scan',
    mounted() {
      this.scanQRCode();
      /*function selectActiveCode(code){
        alert(code);
      }

      let codes = "<div class='lease-active-code' data-code='123123'>123123</div>";
      codes += "<div class='lease-active-code' data-code='223366'>223366</div>";
      this.$dlg.show({
        title: "请选择激活码",
        message: codes
      });*/
    },
    methods: {
      scanQRCode() {
        let curUrl = App.accessTokenHost + "/lease/scan";
        if(this.$wechat.isInWechat() || this.$alipay.isInAlipay()) {
          scanHandler.scan(curUrl);
        } else {
          this.$dlg.prompt("手动输入二维码上12位设备编码", (resp) => {
            scanHandler.getDeviceQRCodeResult(resp);
          })
        }
      },
    }
  }
</script>
