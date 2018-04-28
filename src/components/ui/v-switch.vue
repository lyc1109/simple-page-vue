<template>
  <mt-switch v-model="value" :disabled="disabled" @change="onChange">
    <slot></slot>
  </mt-switch>
</template>

<script>
  export default {
    name: "v-switch",
    props: {
      // 绑定值
      value: {
        type: Boolean,
        default: false
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onChange: function () {
        this.$emit("onchange", this.value);
      }
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);
      }
    }
  }
</script>
