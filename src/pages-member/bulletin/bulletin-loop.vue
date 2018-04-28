<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .bulletin-icon {
    color: $white;
    position: relative;
    span{
      position: absolute;
      top: 3px;
      right: 5px;
      font-size: $s;
    }
  }

  .bulletin-item{
    height: 17px;
    padding: 0 rem(10px);
    overflow: hidden;
  }
</style>

<template>
  <div class="flex bg-white">
    <div class="bulletin-icon ">
      <img src="/static/images/bulletin/bulletin.png" width="50px"/>
      <span>公告</span>
    </div>
    <div class="flex-item bulletin-item">
      <div class="slideInUp"
           v-for="(item,index) in bulletins"
           v-show="index === curBulletinIndex"
           @click="view(item.id)">
        {{item.title}}
      </div>
      <span v-show="bulletins.length === 0">暂无公告</span>
    </div>
    <div>
      <i class="fa fa-angle-right font-lighter icon-m" style="margin-top: -2px"></i>
    </div>
  </div>
</template>

<script>
  import BulletinApi from '@/apis/api-bulletin';
  import types from "@/store/types";

  export default {
    name: "ui-bulletin-loop",
    data: function () {
      return {
        curBulletinIndex: 0,
        bulletins: []
      };
    },
    computed: {
      curShop() {
        return this.$store.getters[types.oauth.getCurShop];
      }
    },
    mounted(){
      BulletinApi.findTop()
        .then((data) => {
          if(data !== null && data.length > 0) {
            this.bulletins = data;
            this.startLoop();
          }
        })
    },
    methods: {
      startLoop: function () {
        const totalLength = this.bulletins.length;
        if(totalLength === 0) {
          return ;
        }
        if(this.curBulletinIndex >= totalLength-1) {
          this.curBulletinIndex = 0;
        } else {
          this.curBulletinIndex++;
        }
        setTimeout(() => {
          this.startLoop();
        }, 5000);
      },

      view: function (id) {
        this.$router.push({
          path: `/community/shop_${this.curShop.id}/article_${id}/view`,
          query: {
            type: 'bulletin'
          }
        });
      }
    }
  }
</script>
