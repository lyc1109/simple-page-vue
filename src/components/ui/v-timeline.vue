<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .timeline{}

  .timeline__item {
    position: relative;
    display: block;
    background: url('/static/images/personal-icon.png') no-repeat -96px -22px;
    padding: 0 0 20px 30px;
    color: $font-primary;

    &:first-child {
      color: $orange-1;
      font-size: 14px;

      &:before {
        display: block;
        content: "";
        position: absolute;
        left: 1px;
        top: 2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid $orange-2;
        background: $white;
        @include box-shadow(0, 0, 10px, $orange-1);
      }
    }
  ;
  }
</style>

<template>
  <div>
    <ul class="timeline" v-if="data.length > 0">
      <li class="timeline__item" v-for="item in data" v-html="item"></li>
    </ul>
    <v-empty v-if="data.length === 0"></v-empty>
  </div>
</template>

<script>
  import VEmpty from "./v-empty";

  export default {
    components: {VEmpty},
    name: "v-timeline",
    props: {
      data: {
        type: Array,
        default: []
      }
    }
  }
</script>

