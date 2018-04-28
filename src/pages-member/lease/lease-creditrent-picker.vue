<!--
芝麻信用分准入查询组件，父组件引入此组件：
  <lease-creditrent-picker :score="'650'" @onOk="onCreditRentAccord"></lease-creditrent-picker>

参数说明：
  score：[必选] 芝麻信用准入分。
  showPicker：用于控制选择器显示隐藏，默认true。

事件：
  onOk: 芝麻分查询准入后回调函数，回传传数据给父组件: fn(isAccord)
-->
<template>
  <v-popup class="full-width" position="bottom" v-model="showPicker" title="芝麻信用免押金准入条件查询">
    <div class="margin-top">
      <v-cell class="v-cell-sm" title="准入分">
        <div class="align-left" slot="value">{{score}}</div>
      </v-cell>
      <v-input class="contact-name form-field required padding-right-m"
               v-model.trim="userCertNo"
               name="userCertNo"
               label="身份证号"
               placeholder="请填写您的身份证号"
               v-validate="'required'"
               data-vv-as="身份证号"
               :error-msg="errors.first('userCertNo')"></v-input>
      <v-input class="contact-name form-field required padding-right-m"
               v-model.trim="userName"
               name="userName"
               label="真实姓名"
               placeholder="请填写您的真实姓名"
               v-validate="'required'"
               data-vv-as="真实姓名"
               :error-msg="errors.first('userName')"></v-input>
    </div>

    <div class="padding-top-m clearfixed">
      <button type="button" class="btn btn-primary btn-lg btn-block" @click="onOk()">准入查询</button>
    </div>
  </v-popup>
</template>

<script>
  import VPopup from "@/components/ui/v-popup"

  import types from "@/store/types";

  import sysApi from "@/apis/api-sys";
  import userApi from "@/apis/api-user";

  export default {
    name: "lease-creditrent-picker",
    components: {VPopup},
    props: {
      score: {
        type: Number,
        require: true,
        default: 0
      },
      // 控制显示、隐藏picker
      showPicker: {
        type: Boolean,
        default: false
      },
    },
    data: function () {
      return {
        // 用户身份证号
        userCertNo: "",
        // 用户真实姓名
        userName: ""
      }
    },
    mounted: function () {
      this.loadStoreUserInfo();
    },
    methods: {
      // 获取用户扩展信息，包含已保存的身份证信息
      loadStoreUserInfo: function () {
        let curUser = this.$store.getters[types.oauth.getCurUser];
        let userExInfo = null;
        if(curUser !== null && curUser.userExInfo) {
          userExInfo = curUser.userExInfo;
        }
        if(userExInfo === null || userExInfo.creditScore === 0) {
          userApi.curUser()
            .then((usr) => {
              this.$store.commit(types.oauth.updateCurUser, usr);
              userExInfo = usr.userExInfo;
              this.userCertNo = userExInfo.certNo;
              this.userName = curUser.name;
            })
        } else {
          this.userCertNo = userExInfo.certNo;
          this.userName = curUser.name;
        }
      },
      onOk: function () {
        const that = this;
        that.$validator.validateAll()
          .then((result) => {
            if (result === true) {
              that.$loading.show();
              sysApi.isCreditRentAccord(that.userCertNo, that.userName, that.score)
                .then((isAccord) => {
                  that.$loading.hide();
                  if(isAccord === true) {
                    // 更新真实姓名缓存
                    that.updateUserName(that.userName);

                    that.$emit('onOk');
                  } else {
                    that.$dlg.alert("抱歉，您的芝麻信用分未达标，无法使用信用免押金租赁，请使用普通租赁方式。");
                    that.$emit('onCancel');
                  }
                })
            }
          });
      },
      onCancel: function () {
        this.$emit('onCancel');
      },
      updateUserName: function (name) {
        let curUser = this.$store.getters[types.oauth.getCurUser];
        curUser.name = name;
        this.$store.commit(types.oauth.updateCurUser, curUser);
      }
    }
  }
</script>
