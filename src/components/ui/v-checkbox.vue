<template>
  <div class="inline-block">
    <label>
      <div class="mint-cell-checkbox inline-block">
        <input type="checkbox" class="mint-checkbox-input" v-model="value" @click="check = !check"/>
        <i class="mint-checkbox-core"></i>
      </div>
      <div class="inline-block"><slot></slot></div>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'v-checkbox',
    props: {
      // 通过v-model传入默认值
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        check: this.value
      }
    },
    watch: {
      value(val){
        this.$emit("input", val)
      },
      check (val) {
        this.$emit("input", val)
      }
    }
  }
</script>
