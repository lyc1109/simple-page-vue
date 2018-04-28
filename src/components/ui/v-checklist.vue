<style scoped type="text/css" lang="scss">
  @import "~variables";
</style>

<template>
  <div>
    <mt-checklist v-model="checkValue"
                  :title="title"
                  :align="align"
                  :max="max"
                  :options="options"
                  :value="value"
                  @change="checkChange(checkValue)" :val="val"></mt-checklist>
  </div>
</template>

<script>
  export default {
    name: 'v-checklist',
    props: {
      // 复选框标题
      title: String,
      // 复选框对齐方式
      align: String,
      // 复选框最多可选个数，超过后其他未选择的选项变成禁用状态
      max: Number,
      // 复选框绑定值
      value: Array,
      // 复选框数据
      options: Array
    },
    data () {
      return{
        val: []
      }
    },
    computed: {
      checkValue: {
        get(){
          if (this.value.length === 0) {
            return []
          }else {
            return this.val
          }
        },
        set(val){
          this.val = val
//          console.log(val)
        }
      }
    },
    methods: {
      checkChange(val){
          this.$emit('checklist',val)
      }
    }
  }
</script>
