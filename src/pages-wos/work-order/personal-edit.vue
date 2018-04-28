<template>
  <div class="bg">
    <div v-if="editType === 'nickname'">
      <v-input type="text" class="form-field required" name="nickname" label="昵称" placeholder="昵称"
               v-model="nickname"
               v-validate="'required'"
               data-vv-as="昵称"
               :error-msg="errors.first('nickname')">
      </v-input>
    </div>
    <div v-if="editType === 'email'">
      <v-input type="email" class="form-field" name="email" label="邮箱" placeholder="邮箱"
               v-model="email"
               v-validate="'email'"
               data-vv-as="邮箱"
               :error-msg="errors.first('email')">
      </v-input>
    </div>
    <div class="page-footer" @click="saveModify">
      <mt-button type="primary" class="btn-save" size="large">保存</mt-button>
    </div>
  </div>
</template>
<script type="text/javascript">
  import types from "@/store/types";

  export default {
    name: 'wos-edit',
    props: ['editData', 'editType'],
    data() {
      return {
        // 昵称
        nickname: '',
        // 邮箱
        email: ''
      }
    },
    created() {
      // 初始化赋值
      if(this.editData) {
        this.nickname = this.editData.nickname;
        this.email = this.editData.email;
      } else {
        this.$emit('cancel');
      }
    },
    methods: {
      /**
       * 保存数据
       * @returns {boolean}
       */
      saveModify() {
        let _params = {};
        let _flag = false;
        let that = this;
        if(that.editType === 'nickname') {
          if(that.nickname === '') {
            this.$toast.error('昵称不能为空');
            return false;
          } else {
            _params = {
              'nickname': that.nickname
            }
            _flag = true;
          }
        } else if(that.editType === 'email') {
          _params = {
            'email': that.email
          }
          _flag = true;
        }

        if (_flag) {
          that.$http.post(`${that.$apihost}/user`,_params)
            .then((res) => {
              window.location.hash = '';
              that.$bus.emit('update-user');
              that.$emit('cancel');
            })
        } else {
          that.$emit('cancel');
        }
      }
    }
  }
</script>
