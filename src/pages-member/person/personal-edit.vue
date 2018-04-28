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
    <div class="page-footer flex" @click="saveModify">
      <button type="primary" class="btn btn-primary btn-save flex-item margin-left-zero" size="large">保存</button>
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
        nickname: '',
        email: ''
      }
    },
    created() {
      if(this.editData) {
        this.nickname = this.editData.nickname;
        this.email = this.editData.email;
      } else {
        this.$emit('cancel');
      }
    },
    methods: {
      //保存数据
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
              that.$router.go(-1);
              that.$bus.emit('update-user');
              that.$emit('cancel');
            })
        } else {
          that.$router.go(-1);
          that.$emit('cancel');
        }
      }
    }
  }
</script>
