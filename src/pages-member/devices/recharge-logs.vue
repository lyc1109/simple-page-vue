<style scoped lang="scss" type="text/scss">
  @import 'src/assets/scss/components/_popupwindow';
  .flex .flex-item {
    flex: 1;
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
  .popup-window .popup-window-content {
    background: $page_bg;
    .popup-window-body{
      padding-top: 0;
      overflow: auto;
      .log-timeline {
      }
    }
  }
  .log-timeline {
    position: relative;
    padding: 0;
    background: white;
    margin-bottom: 0;
    min-height: calc(100% - 120px);
    &:before {
      content: '';
      position: absolute;
      top: rem(30px);
      left: rem(32px);
      height: 100%;
      width: 1px;
      background: $gray;
      opacity: 0.5;
    }
    .log-timeline-row {
      position: relative;
      margin-top: rem($m);
      &:first-child {
        margin-top: 0;
      }
      &:last-child:before{
        position: relative;
      }
      .log-timeline-node {
        width: rem(20px);
        margin: 0 rem($s);
        display: inline-block;
        position: relative;
      }
      .logs-circle {
        width: 8px;
        height: 8px;
        background: $gray;
        display: inline-block;
        margin-left: 3px;
        @include border-radius(50%);
        position: absolute;
        top: 0;
      }
      .log-timeline-content {
        text-align: left;
        color: $font-light;
        @extend %valign-center;
        -webkit-box-align: flex-start;
        -ms-flex-align: flex-start;
        -webkit-align-items: flex-start;
        align-items: flex-start;
        .log-timeline-log {
          float: left
        }
        .log-timeline-time {
          width: 160px;
          float: left;
          display: inline-block
        }
        &:after {
          content: "";
          display: table;
          clear: both
        }
      }
    }
    .active {
      .log-timeline-node {
        background-color: transparent;
        border-color: transparent;
      }
      .log-timeline-content {
        color: $font-title;
        .fa {
          color: $primary;
          font-size: 16px;
        }
      }
    }
  }
</style>

<template>
  <div class="popup-window in">
    <div class="popup-window-content">
      <div class="popup-window-title flex bg-yellow-4">
        <h4>缴费记录</h4>
        <div class="flex-item"></div>
        <!--<span class="close" data-dismiss="popupwindow" @click="cancelLogs">x</span>-->
        <i class="iconfont icon-guanbi font-lighter" @click="cancelLogs"></i>
      </div>
      <div class="popup-window-body">
        <slot>
          <div class="log-timeline padding-m" v-if="logs && logs.length > 0">
            <div v-for="(log,index) in logs"
                 class="log-timeline-row"
                 :class="{active : index === 0}">
              <div v-if="log !== undefined && null !== log && log !== 'null'">
                <div class="log-timeline-content flex">
                  <div class="log-timeline-node">
                    <i v-if="index === 0" class="fa fa-circle-o"></i>
                    <span v-else class="logs-circle"></span>
                  </div>
                  <span>{{ $filters.formatDate(log.created) }}</span>
                  <span class="margin-left-s">{{ log.leaseProductPackageName }}</span>
                  <span class="margin-left-m">¥{{ log.formatTotalAmount }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="!(logs && logs.length > 0)" style="height: calc(100% - 100px);justify-content: center" class="valign-center bg-white">
            暂无缴费记录哟~
          </div>
        </slot>
      </div>
      <div class="popup-window-footer">
        <button type="button" class="btn btn-primary btn-block" id="btnPopupOk" @click="onOk">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "logs-recharge",
    props: ['logs'],
    data() {
      return {
        isActive: true
      }
    },
    methods: {
      onOk: function () {
        this.$emit("cancel")
      },
      cancelLogs: function () {
        this.$emit("cancel")
      }
    }
  }
</script>
