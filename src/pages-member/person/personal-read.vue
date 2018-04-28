<style scoped type="text/scss" lang="scss">
  @import '~variables';

  .user-img-box {
    background: $white;
    justify-content: center;
    padding: rem(65px);
  }
  .logs-timeline,
  .transfer-page,
  .valuation-page {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  .valuation-page {
    background-color: #f8f8f9;
  }
  .user-img-box {
    position: relative;
    flex-direction: column;
    .file-input,
    .wrapper {
      position: absolute;
      top: rem(50px);
      left: 0;
      width: 100%;
      height: rem(150px);
      z-index: 999;
    }

    .file-input {
      opacity: 0;
    }
    .usr-image {
      vertical-align: middle;
      border: rem(3px) solid #bfe9f3;
      width: rem(90px);
      height: rem(90px);
      overflow: hidden;
      position: relative;
      .user-image {
        vertical-align: middle;
        /*border: rem(3px) solid #bfe9f3;*/
        width: rem(90px);
        height: rem(90px);
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .btn-group {
    height: rem(40px);

    .btn {
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0;

      &:first-child {
        border-right:none;
      }
    }
  }

  .page-footer {
    .btn-save {
      width: 100%;
      @include border-radius(0);
    }
  }

  .info-group {
    .info-field-item {
      &:last-child {
        border: none;
      }

      .info-title {
        width: rem(40px);
        display: inline-block;
      }
    }
  }

  .personal-edit-page {
    width: 100%;
    height: 100%;
    background-color: $page_bg;
  }
  .btn {
    border: rem(1px) solid $font-lighter;
  }
  .uploading-bg {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 99;
    background: rgba(0,0,0,.5);
  }
</style>
<style type="text/scss" lang="scss">
  .mint-cell .mint-cell-wrapper {
    padding: 15px;
  }
  .user-img-box {
    .g-core-image-upload-btn {
      position: initial;

      .g-core-image-upload-form {
        top: 50px!important;
      }
    }
  }
</style>
<template>
  <div>
    <app-view :hasFooter="false">
      <!-- 头像 -->
      <div class="user-img-box valign-center">
        <div class="border-radius-circle usr-image" style="position:relative;overflow: hidden">
          <div v-if="isLoading" class="uploading-bg" :style="{ height: progress + '%'  }"></div>
          <div class="user-image bg-image border-radius-circle">
            <img v-lazy="$filters.avatar(usrAvatar ? usrAvatar : '')" alt="">
          </div>
        </div>
        <div v-show="isLoading === false && progress !== 100" class="padding-top font-lighter align-center">
          <v-image className="img-item"
                   btnText="点击修改头像"
                   crop="local"
                   :changeImg="imagechanged"
                   successTips=""
                   errorTips="所选文件类型有误！"
                   :uploadImg="uploadImg"
                   :uploadErr="uploadErr"></v-image>
        </div>
      </div>
      <!-- 个人信息 -->
      <div class="user-info-field margin-bottom-xxl padding-bottom">
        <div class="info-group bg-white padding-left-m margin-top">
          <!--<router-link class="a-default" :to="'/wos/personal/' + entity.id + '/edit'">-->
          <div class="info-field-item padding-m border-bottom padding-left-zero flex" @click="editPerson('nickname')">
            <div class="font-light info-title padding-right-m">昵称</div>
            <div class="flex-item flex">
              <div class="flex-item" style="font: 13.3333px Arial;">{{ entity.nickname }}</div>
              <i class="fa fa-angle-right font-lighter font-s"></i>
            </div>
          </div>
          <!--</router-link>-->
          <v-selector class="form-field"
                      label="性别"
                      placeholder="请选择性别"
                      v-model="gender"
                      :data="sexs"
                      value="gender"
                      :labelKey="((entity.sex && entity.sex === 'F') ? '女' : '男')"
                      :callback="saveSex"></v-selector>
          <v-date-picker class="form-field" label="生日" placeholder="请选择"
                         v-model="birthday"
                         :startDate="startDate"
                         :endDate="endDate"
                         :defaultVal="birthday"
                         :callback="saveBirthday"></v-date-picker>
        </div>
        <div class="info-group bg-white padding-left-m margin-top">
          <div class="info-field-item padding-m border-bottom padding-left-zero flex">
            <div class="font-light info-title padding-right-m">手机号</div>
            <div class="flex-item" style="font: 13.3333px Arial;">
              {{ entity.mobile }}
            </div>
          </div>
          <div class="info-field-item padding-m border-bottom padding-left-zero flex" @click="editPerson('email')">
            <div class="font-light info-title padding-right-m">邮箱</div>
            <div class="flex-item flex">
              <div class="flex-item" style="font: 13.3333px Arial;">{{ entity.email }}</div>
              <i class="fa fa-angle-right font-lighter font-s"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="page-footer padding bg-white flex">
        <div class="flex-item"></div>
        <button type="button" class="btn btn-sm btn-round" @click="back()">返回</button>
      </div>

      <mt-popup v-model="editPopup"
                popup-transition="popup-fade" class="personal-edit-page">
        <childPage :editData="entity" :editType="editType" @cancel="editPopup = false"></childPage>
      </mt-popup>
    </app-view>
  </div>
</template>
<script type="text/javascript">
  import types from "@/store/types";
  import VDatePicker from "@/components/ui/v-date-picker";
  import VSelector from "@/components/ui/v-selector";
  import VImage from "@/components/ui/v-image";
  import childPage from "./personal-edit";
  import moment from "moment";

  export default {
    name: 'wos-personal',
    data() {
      return {
        // 性别中文显示
        gender: '男',
        // 性别中文选项
        sexs: ['男', '女'],
        // 个人数据
        entity: {},
        // 生日
        birthday: '',
        // 用户头像
        avatarPath: '',
        // 修改弹窗
        editPopup: false,
        // 修改类型
        editType: '',
        // 头像上传进度条
        progress: 0,
        // 是否正在上传中
        isLoading: false,
        timer: undefined,
      }
    },
    created: function() {
      this.initUser();
    },
    computed: {
      // 最小可选择日期
      startDate() {
        let _date = moment().startOf('year').subtract('80','years').toDate();
        return _date;
      },
      // 最大日期默认当天
      endDate() {
        const date = moment();
        return date.toDate();
      },
      // 用户头像
      usrAvatar() {
        let that = this;
        let _avatar = that.entity && that.entity.avatar;
        if(that.avatarPath) {
          _avatar = that.avatarPath;
        }
        return _avatar;
      }
    },
    mounted() {
      let that = this;
      that.$nextTick(() => {
        that.$bus.on('update-user', () => {
          that.initUser();
        });

        window.onpopstate = () => {
          if(!window.location.hash) {
            that.editPopup = false;
          }
        }
      })
    },
    watch: {
      progress(_progress) {
        let that = this;
        if(_progress >= 100) {
          clearInterval(that.timer);
          that.timer = null;
          setTimeout(function() {
            that.$toast.success('修改头像成功');
            that.progress = 0;
            that.isLoading = false;
            let curUser = that.$store.getters[types.oauth.getCurUser];
            curUser.avatar = that.avatarPath;
            that.$store.commit(types.oauth.updateCurUser, curUser);
          },500);
        }
      }
    },
    methods: {
      /**
       * 获取用户数据
       * @param _callback   修改的数据
       */
      getUser(_callback) {
        let that = this;
        that.$http.get(`${that.$apihost}/user`)
          .then((resp) => {
            that.entity = resp;
            _callback && _callback(resp);
          });
      },
      /**
       * 初始化数据
       */
      initUser() {
        let that = this;
        that.$store.state.showLoading = true;

        let init = function() {
          if(that.entity) {
            let _day = that.$filters.formatDate(new Date());
            let _sex = that.entity.sex;

            if(that.entity && that.entity.birthday) {
              _day = that.$filters.formatDate(that.entity.birthday);
            }
            that.birthday = _day;

            if(_sex) {
              if(_sex === 'M') {
                that.gender = '男';
              } else if(_sex === 'F') {
                that.gender = '女';
              }
            }
            that.$store.state.showLoading = false;
          }
        };

        that.getUser(function (res) {
          that.entity = res;
          init();
        });
      },
      /**
       * 保存修改
       * @param _params   修改的数据
       */
      saveModify(_params) {
        let that = this;
        if(JSON.stringify(_params) !== '{}') {
          that.$http.post(`${that.$apihost}/user`,_params)
            .then((res) => {
              that.getUser(function(person) {
                that.$store.commit(types.oauth.updateCurUser, person);
              });
              that.$toast.success('修改成功');
            })
        }
      },
      /**
       * 修改生日
       * @param value   修改数据
       */
      saveBirthday(value) {
        let _params = _params = {
          'birthday': this.$filters.formatDate(value)
        };
        this.saveModify(_params);
      },
      /**
       * 修改生日
       * @param value   修改数据
       */
      saveSex(value) {
        let _params = _params = {
          'sex': (this.gender === '女' ? 'F' : 'M')
        };
        this.saveModify(_params);
      },
      /**
       * 成功上传图片回调
       */
      uploadImg(res) {
        let that = this;
        let _path = res && res[0] && res[0].path;
        that.isLoading = true;
        that.$http.post(`${that.$apihost}/user/avatar`, {
          avatar: _path
        })
          .then((res) => {
            that.avatarPath = _path;
            that.timer = setInterval(() => {
              if(that.progress < 100) {
                that.progress++;
              }
            }, 20);
          })
      },
      /**
       * 上传图片失败回调
       */
      uploadErr(res) {
        this.$toast.error('修改头像失败');
      },
      /**
       * 选择图片
       * @param res
       */
      imagechanged(res) {
        let that = this;
        that.$bus.emit('upload-img');
      },
      /**
       * 编辑个人信息
       * @param _type
       */
      editPerson(_type) {
        this.editPopup = true;
        this.editType = _type;
        window.location.hash = 'edit';
      },
      /**
       * 返回
       */
      back() {
        window.history.go(-1);
      }
    },
    components: {
      VDatePicker,
      VSelector,
      VImage,
      childPage,
    }
  }
</script>
