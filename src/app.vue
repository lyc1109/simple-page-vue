<style lang="scss" scoped type="text/scss">
  @import "~variables";

  .slide-in-enter-active {
    @include slideInRight(0.3s)
  }
  .slide-out-leave-active {
    @include slideOutRight(0.3s)
  }

  .fade-enter-active {
    @include fadeIn(0.3s);
  }
  .fade-leave-active {
    @include fadeOut(0.3s);
  }

  #app{
    margin: 0 auto;
    max-width: $max-width;
    height: 100%;
    min-height: 100%;
    position: relative;
    overflow: auto;
  }
</style>

<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        transitionName: ""
      }
    },
    watch: {
      $route: function (to, from) {
        // 首页4个导航不需要动画
        const exculdeRoute = "member,devices,orders,my,login,logout,accesstoken";
        if(exculdeRoute.indexOf(to.name) > -1) {
          this.transitionName = "";
          return ;
        }

        const toDepth = to.path.split('/').length;
        const fromDepth = from.path.split('/').length;
        if(toDepth === fromDepth) {
          this.transitionName = "fade";
        } else {
          this.transitionName = toDepth > fromDepth ? 'slide-in' : 'slide-out'
        }
      }
    }
  }
</script>
