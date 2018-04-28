<style scoped lang="scss" type="text/scss">
  @import 'src/assets/scss/components/_popupwindow';

  .transfer-page {
    .popup-window-title {
      h4 {
        text-align: left;
      }
    }
    .popup-window-body {
      .cell-group {
        .cell-item {
          &:last-child {
            @include border(bottom);
          }
        }
        div {
          &:last-child {
            .cell-item {
              border-bottom: none;
            }
          }

        }
      }
      #remark {
        width: 100%;
        resize: none;
        border: none;
        @extend %padding-m;
        padding-left: 0!important;
      }
    }
  }
</style>
<style lang="scss" type="text/scss">
  @import "~variables";

  .v-modal {
    opacity: .7;
    filter: Alpha(opacity=70);
  }
  .transfer-page.mint-popup {
    top: initial!important;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    overflow: hidden;
    height: auto!important;
    -webkit-transform: initial!important;
    transform: initial!important;
    .popup-window {
      position: relative;
    }
    .popup-window-content {
      height: auto!important;
      padding-bottom: rem(45px);
      .popup-window-footer {
        position: fixed!important;
      }
    }
    .popup-window-body {
      background-color: #fff!important;
    }
    .mint-swipe {
      height: rem(120px);
      .mint-swipe-item {
        width: 100%;
        .item-box {
          flex-direction: column;
          .img-box {
            width: 100%;
            padding-top: 100%;
            overflow: hidden;
            position: relative;
            .serviceman-avatar {
              position: absolute;
              top: 2px;
              left: 2px;
              width: calc(100% - 4px);
              height: calc(100% - 4px);
              box-sizing: border-box;
              @include border(all,$border);
            }
          }
          &.current {
            .img-box {
              position: relative;
              .bg-circle-box {
                position: absolute;
                top: 2px;
                bottom: 2px;
                left: 2px;
                right: 2px;
                z-index: 99;
                background: rgba($primary,.6);
              }
              .serviceman-avatar {
                @include border(all,$primary);
              }
            }
          }
        }
      }
      .mint-swipe-indicators {
        @extend %valign-center;
        .mint-swipe-indicator {
          height: 6px;
          width: 6px;
          &.is-active {
            width: 8px;
            height: 8px;
            background: $primary;
          }
        }
      }
    }
    .mint-cell {
      line-height: inherit;
      min-height: inherit;
      height: auto;
      background: $page_bg;
      @extend %padding;
      @include border();
      @include border-radius(5px);
      .mint-field-core {
        background: $page_bg;
      }
    }
  }
  .btn-primary {
    background-color: $primary!important;
    color: white!important;
  }
</style>
<template>
  <div class="popup-window in" title="转单">
    <div class="popup-window-content" @click.stop="">
      <div class="popup-window-title flex bg-yellow-4">
        <h4 class="color">请选择工单处理人</h4>
        <div class="flex-item"></div>
        <!--<span class="close" data-dismiss="popupwindow" @click="cancelLogs">x</span>-->
        <i class="iconfont icon-iot-guanbi font-lighter" @click="cancelLogs"></i>
      </div>
      <div class="popup-window-body" ref="remarkPannel">
        <div v-if="!isInitPerson" class="valign-center bg" style="justify-content: center;min-height: 263px;">
          <v-spinner :isAllPage="false"></v-spinner>
        </div>
        <div v-if="isInitPerson">
          <div v-if="activeId">
            <mt-swipe :show-indicators="showIndicators" :continuous="true" :speed="0" :auto="0" class="bg-white padding-l">
              <!--{{listData}}-->
              <mt-swipe-item v-if="listData"
                             v-for="(list, index) in listData" :key="index">
                <div class="flex">
                  <div v-if="list" v-for="service in list"
                       class="flex-item flex align-center margin-s item-box"
                       :class="{ 'current': service && service.userDto && (activeId === service.userDto.id) }"
                       @click="selectPerson(service.userDto && service.userDto.id ? service.userDto.id : '')">
                    <div class="img-box border-radius-circle" v-if="service">
                      <div v-if="service && service.userDto && (activeId === service.userDto.id)"
                           class="bg-image border-radius-circle bg-circle-box"></div>
                      <!--<div class="border-radius-circle ">-->
                      <!--<div class="valign-center">-->
                      <img v-lazy="$filters.img(service.userDto && service.userDto.avatar,'')" alt="" class="border-radius-circle serviceman-avatar">
                      <!--</div>-->
                      <!--</div>-->
                    </div>
                    <div class="margin-top-s text-wrapper"
                         :class="{ 'color-primary': service && service.userDto && (activeId === service.userDto.id) }"> {{ service && service.name }} </div>
                  </div>
                </div>
              </mt-swipe-item>
            </mt-swipe>
            <div class="padding-m padding-top-zero bg-white padding-bottom-xxl flex">
              <div class="bg-light border-radius padding flex-item">
                <input type="text" placeholder="给对方留言" class="key-input padding-left bg-light mint-field-core" v-model="remark">
                <i class="iconfont icon-iot-guanbi font-lighter" @click="clearInput" :style="{'display': remark.length > 0 ? 'inline-block' : 'none' }"></i>
              </div>
            </div>
          </div>
          <div v-if="!activeId" class="valign-center bg" style="justify-content: center;min-height: 263px;">
            暂无可转单师傅可选~
          </div>
        </div>
      </div>
      <div class="popup-window-footer">
        <button type="button" class="btn btn-block disabled-btn"
                :class="{ 'btn-primary': isInitPerson && activeId }"
                @click.stop="onOk">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
  import types from "@/store/types";
  import VSpinner from '@/components/ui/v-spinner';

  export default {
    name: 'transfer-page',
    props: ['type', 'order'],
    components: {VSpinner},
    data() {
      return {
        // 转单备注
        remark: '',
        // 转单师傅
        persons: [],
        // 选中人员的id
        activeId: '',
        // 处理够的人员列表数据
        listData: {},
        // 是否处理完工人数据
        isInitPerson: false,
        // 是否显示轮播图底部圆点
        showIndicators: true,
        // 初始的clientHeight, 用以处理移动端键盘遮挡转单说明输入框
        initClientH: 0,
        // 工单id
        entityId: this.order && this.order.serviceVendor && this.order.serviceVendor.id
      }
    },
    created: function () {
      let that = this;
      that.initClientH = window.document.body.clientHeight;

      //获取转单人员
      if(that.entityId) {
        that.$http.get(`${that.$apihost}/shops/${that.entityId}/servicemans`)
          .then((resp) => {
            if(resp) {
              that.persons = resp;
              let _person = that.persons;
              //去除当前用户
              for(let i = 0,len = _person.length; i < len; i++) {
                let _temp = _person[i].userDto;
                if(_temp && _temp.id === that.curUser.id) {
                  _person.splice(i,1);
                  break;
                }
              }
              let _serviceLen = _person.length;
              let _module = parseInt((_serviceLen - (_serviceLen%4)) / 4) + (_serviceLen%4 > 0 ? 1 : 0);      //轮播图总共页数


              if(_module <= 1) {
                that.showIndicators = false;                            //不显示底部圆点
              }

              //处理数据结构
              for(let j = 0; j < _module; j++) {
                let _start = parseInt(j*4);
                let _list = {};
                for(let k = 0; k < 4; k++) {
                  that.$set(_list, k, _person[_start+k]);
                }
                that.$set(that.listData, j, _list);
              }

              that.isInitPerson = true;
              that.activeId = that.persons[0].userDto.id;
            }
          });
      } else {
        that.$messenger.alert('数据异常！请联系管理员');
        return false;
      }
    },
    computed: {
      // 当前用户数据
      curUser() {
        return this.$store.getters[types.oauth.getCurUser];
      }
    },
    methods: {
      /**
       * 转单
       */
      onOk: function () {
        let that = this;
        if(that.isInitPerson && that.activeId) {
          if(!that.activeId) {
            that.$messenger.alert('请选择转单人员！');
            return;
          }
          that.$dlg.confirm("是否确定转单？", () => {
            let params = {
              'assignee_id': that.activeId,
              'memos': that.remark
            };

            let _location = that.$route.fullPath;
            that.$http.post(this.$woshost + "/workorders/" + that.order.id + "/transfer", params)
              .then((resp) => {
                that.$messenger.alert('操作成功');
                that.$store.commit(types.wos.setPageData, null);
                that.$emit("cancel");
                setTimeout(function () {
                  if(_location.indexOf('/wos/index') > -1) {
                    that.$router.go(0);
                  } else if(_location.indexOf('/wos/workOrder') > -1) {
                    that.$router.push('/wos/index');
                  }
                }, 200);
              });
          });
        }
      },
      /**
       * 取消
       */
      cancelLogs: function () {
        this.$emit("cancel");
      },
      /**
       * 选择转单人员
       * @param person
       */
      selectPerson: function (person) {
        this.activeId = person;
      },
      /**
       * 清空备注
       */
      clearInput() {
        this.remark = '';
      }
    }
  }
</script>
