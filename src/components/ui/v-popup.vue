<style lang="scss" scoped>
  .mint-popup{
    overflow: auto;
  }
</style>

<template>
<div>
  <mt-popup v-model="value" :position="position" :class="popupClass" :closeOnClickModal="closeOnClickModal">
    <div class="flex padding border-bottom align-left" style="background: #F6EFD8" v-show="isShowHeader">
      <div class="flex-item font-m font-primary">{{title}}</div>
      <div class="align-right" @click="value = false"><i class="fa fa-times-circle icon-m font-light"></i></div>
    </div>
    <slot></slot>
  </mt-popup>
</div>
</template>

<script>
    export default{
      name: "v-popup",
      props: {
        value: {
          type: Boolean,
          default: false
        },
        title: {
          type: String,
          default: ""
        },
        position: {
          type: String,
          default: "right"
        },
        closeOnClickModal: {
          type: Boolean,
          default: false
        },
        fullWidth: {
          type: Boolean,
          default: true
        },
        fullScreen: {
          type: Boolean,
          default: false
        },
        // 已废弃，请使用v-model代替
        showPopup: {
          type: Boolean,
          default: false
        },
      },
      mounted: function () {
        if(this.showPopup !== false) {
          this.value = this.showPopup;
        }
      },
      computed: {
        popupClass: function () {
          if(this.fullScreen) {
            return "full-screen";
          }
          if(this.fullWidth) {
            return "full-width";
          }
          return "";
        },
        isShowHeader: function () {
          return this.title !== "";
        }
      },
      watch: {
        value: function (newVal) {
          this.$emit("input", newVal);
        }
      }
    }
</script>
