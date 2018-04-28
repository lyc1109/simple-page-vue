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
    .popup-window-body {
      padding-top: 0;
      overflow: auto;
    }
  }
  .log-timeline {
    position: relative;
    padding: 0;
    background: white;
    margin-bottom: rem(90px);
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
        width: 6px;
        height: 6px;
        background: $gray;
        display: inline-block;
        margin-left: 4px;
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
  <div class="popup-window in" title="工单处理日志">
    <div class="popup-window-content bg">
      <div class="popup-window-title flex bg-yellow-4">
        <h4>工单处理日志</h4>
        <div class="flex-item"></div>
        <!--<span class="close" data-dismiss="popupwindow" @click="cancelLogs">x</span>-->
        <!--<i class="iconfont icon-iot-guanbi font-lighter" @click="cancelLogs"></i>-->
      </div>
      <div class="popup-window-body">
        <slot>
          <div class="log-timeline padding-m">
            <div class="log-timeline-row" v-for="(log,index) in logs" :class="{active : index === 0}">
              <div v-if="log.log !== undefined && null !== log.log &&  log.log !== 'null'">
                <div class="log-timeline-content flex">
                  <div class="log-timeline-node">
                    <i v-if="index === 0" class="iconfont icon-iot-time color-primary"></i>
                    <span v-else class="logs-circle"></span>
                  </div>
                  <!--<span>{{ log.created | moment('YYYY-MM-DD HH:mm') }}</span>-->
                  <!--&nbsp;&nbsp;-->
                  <div class="flex-item flex" style="flex-direction: column;">
                    <div>{{ log.log }}</div>
                    <div class="flex-item">{{ $filters.formatDate(log.created,'YYYY-MM-DD') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </slot>
      </div>
      <div class="popup-window-footer">
        <button type="button" class="btn btn-primary btn-block" id="btnPopupOk" @click="cancelLogs">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "logs-timeline",
    props: ["logs"],
    methods: {
      /**
       * 关闭弹窗
       */
      cancelLogs: function () {
        this.$emit("cancel")
      }
    }
  }
</script>
