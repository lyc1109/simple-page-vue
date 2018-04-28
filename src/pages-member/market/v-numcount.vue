<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .numcount {
    display: flex;
    align-items: center;
    width: rem(97px);
    @include border();

    input {
      border: none;
      width: 30px;
      height: 26px;
      line-height: 26px;
      padding: 0 3px;
      text-align: center;
      font-size: rem($font-size-m);
      @include border(left);
      @include border(right);
    }

    .num-subtract,
    .num-add{
      padding: 3px 10px;
      font-size: rem(20px);
    }
  }
</style>

<template>
  <div class="numcount">
    <div class="inline-block num-subtract" @click="subtractNum">-</div>
    <div class="inline-block">
      <input type="text" v-model="value"/>
    </div>
    <div class="inline-block num-add" @click="addNum">+</div>
  </div>
</template>

<script>
  export default {
    name: "v-numcount",
    desc: "数量计数器",
    props: {
      value: {
        type: Number,
        default: 1
      },
      // 最小数量
      min: {
        type: Number,
        default: 1
      },
      // 最大数量，0表示不限制
      max: {
        type: Number,
        default: 0
      },
      listId: {
        type: Number,
        default: 0
      }
    },
    methods: {
      subtractNum: function () {
        if (this.value === this.min) {
          return;
        }
        this.value--;
      },
      addNum: function () {
        if (this.max > 0 && this.value >= this.max) {
          return;
        }
        this.value++;
      }
    },
    watch: {
      value(newVal) {
        this.$emit("input", newVal);
        this.$emit('listId', this.listId)
      }
    }
  }
</script>

