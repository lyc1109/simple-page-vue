<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .finish {
    font-size: rem(50px);
    color: rgba($red-1,.5);
    position: absolute;
    top: rem(-25px);
    right: rem(-25px);
  }
  .status-tag {
    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 4px;
        height: 4px;
        background: red;
        border-radius: 50%;
      }
    }
    &.blue-status-1 {
      color: $primary;
      .status-dot {
        background: rgba($primary, .4);

        &:before {
          background: $primary;
        }
      }
    }
    &.blue-status-2 {
      color: $blue-2;
      .status-dot {
        background: rgba($blue-2,.4);

        &:before {
          background: $blue-2;
        }
      }
    }
    &.red-status {
      color: $red-1;
      .status-dot {
        background: rgba($red-1, .4);

        &:before {
          background: $red-1;
        }
      }
    }
    &.orange-status {
      color: $orange-1;
      .status-dot {
        background: rgba($orange-1,.4);

        &:before {
          background: $orange-1;
        }
      }
    }
    &.green-status-1 {
      color: $green-2;
      .status-dot {
        background: rgba($green-2,.4);

        &:before {
          background: $green-2;
        }
      }
    }
    &.green-status-2 {
      color: $green-2;
      .status-dot {
        background: rgba($green-2,.4);

        &:before {
          background: $green-2;
        }
      }
    }
  }
</style>
<template>
  <div>
    <b class="finish iconfont icon-IOT-wc font-bold-400" v-if="orderStatus === 80 && type === 'list'"></b>
    <div v-if="statusItem"
         class="status-tag"
         :class="{
           'blue-status-1': orderStatus && orderStatus === 10,
           'blue-status-2': orderStatus && orderStatus === 40,
           'red-status': (orderStatus === 0 || orderStatus === 60 || orderStatus === 70 || orderStatus === 85 || orderStatus === 90 || orderStatus === 95),
           'orange-status': (orderStatus === 15 || orderStatus === 20 || orderStatus === 92),
           'green-status-1': orderStatus && orderStatus === 45,
           'green-status-2': (orderStatus === 41 || orderStatus === 60 || orderStatus === 80)
          }">
      <i v-if="(orderStatus === Number(statusItem.name)) && orderStatus !== 80 && type === 'list'"
         class="status-dot"></i>
      <span v-if="orderStatus === Number(statusItem.name) && orderStatus !== 80 && type === 'list'">{{ statusItem.value }}</span>
      <span v-if="orderStatus === Number(statusItem.name) && type === 'view'">{{ statusItem.value }}</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'tplStatus',
    props: ['order','type','statusList'],
    data() {
      return {
        statusData: {}
      }
    },
    created() {
      let that = this;
      if(that.type === 'list' && that.statusList && that.statusList.length > 0) {
        that.statusData = that.statusList;
      } else {
        that.$http.get(`${that.$apihost}/serviceorders/const/status`)
          .then((status) => {
            that.statusData = status;
          })
      }
    },
    computed: {
      orderStatus() {
        return Number(this.order && this.order.status);
      },
//      statusData() {
//        let that = this;
//        let _data = [];
//        if(that.type === 'list' && that.statusList && that.statusList.length > 0) {
//          _data = that.statusList;
//        } else {
//          that.$http.get(`${that.$apihost}/serviceorders/const/status`)
//            .then((status) => {
//              _data = status;
//            })
//        }
//        return _data;
//      },
      statusItem() {
        let that = this;
        let _temp = that.statusData;
        let _item = {};

        if(that.type === 'list' && _temp) {
          for(let i = 0,len = _temp.length; i < len; i++) {
            let _name = _temp[i].name;
            if(Number(_name) === Number(that.order.status)) {
              _item = _temp[i];
              break;
            }
          }
        }
        return _item;
      }
    }
  }
</script>
