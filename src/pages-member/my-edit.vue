<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .imgBox{
    width: 100%;
    text-align: center;

    img{
      border-radius: 50%;
      border: rem(3px) solid rgba(43, 182, 242, 0.2);
      width: rem(90px);
    }
    .file-input,.wrapper{
      position: absolute;
      top: rem(50px);
      width: 100%;
      left: 0;
      height: rem(150px);
    }
    .file-input{
      opacity: 0;
    }
    .g-core-image-upload-btn{
      padding-top: rem(120px);
    }

    /*p{*/
      /*font-size: 18px;*/
      /*color: #666;*/
    /*}*/
  }
  .btn{
    background-color: $primary;
    color: #fff;

    &.cancel{
      background: $white;
      color: $font-light;
    }
  }
  .save{
    flex: 2;
  }
</style>

<template>
  <app-view :hasFooter="true">
    <div class="padding bg-white flex">
      <div class="align-center padding-top-xxl padding-bottom-xxl imgBox">
        <img class="img-circle" :src="$filters.avatar(userInfo.avatar)" v-lazy="$filters.avatar(userInfo.avatar)" alt="">
        <!--<input type="file" class="file-input" multiple="multiple" ref="upload">-->
        <!--<div class="padding-top font-lighter align-center">-->
          <!--<div class="wrapper">-->
            <!--<vue-core-image-upload crop-ratio="1:1"-->
                                   <!--crop="local"-->
                                   <!--resize="local"-->
                                   <!--extensions="png,jpg,svg,gif,jpeg"-->
                                   <!--text="点击修改头像"-->
                                   <!--:isXar="false"-->
                                   <!--v-model="uploadUrl"-->
                                   <!--ref="inputCheck"-->
                                   <!--@imagechanged="changeImg"-->
                                   <!--@imageuploaded="uploadImg"></vue-core-image-upload>-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </div>
    <div class="padding-left padding-right bg-white margin-top">
        <v-input class="form-field"
                 v-model="userInfo.nickname"
                 name="contactName"
                 label="昵称"
                 placeholder="请输入昵称"
                 v-validate="'required'"
                 data-vv-as="昵称"
                 :error-msg="errors.first('contactName')"></v-input>
      <v-cell title="性别" class="sexTit">
        <v-radio :options="sexOptions" v-model="userInfo.sex" :class="{ 'maleBox': sex.isMale,'femaleBox': sex.isFemale }"></v-radio>
      </v-cell>
      <v-date-picker class="form-field" label="生日" placeholder="请选择生日日期"
                     v-model="userInfo.birthday"
                     :startDate="startDate"
                     :endDate="endDate"
                     :defaultVal="$filters.formatDate(userInfo.birthday)"
                     :error-msg="errors.first('birthday')"></v-date-picker>
    </div>
    <div class="padding-left padding-right bg-white margin-top">
      <v-input class="form-field"
               v-model="userInfo.mobile"
               name="contactMobile"
               label="手机号码" :disabled="disabled"></v-input>
      <v-input class="form-field"
               v-model="userInfo.email"
               name="contactEmail"
               label="邮箱"
               placeholder="请填写有效邮箱"></v-input>
    </div>
    <div slot="footer" class="footer flex">
      <div class="flex-item">
        <button type="button" class="btn btn-block cancel" @click="$router.go(-1)">取消</button>
      </div>
      <div class="flex-item save">
        <button type="button" class="btn-block btn" @click="save()">保存</button>
      </div>
    </div>
  </app-view>
</template>

<script>
  import types from '@/store/types'
  import VCell from '@/components/ui/v-cell'
  import VDatePicker from '@/components/ui/v-date-picker'
  import VRadio from '@/components/ui/v-radio'
  import moment from "moment"
  import Toast from '@/assets/scripts/messenger'
  import VueCoreImageUpload from 'vue-core-image-upload'
  import { Lazyload } from 'mint-ui'

  export default {
    name: 'my-edit',
    data(){
      return {
        disabled: true,
        fileArr: [],
        sex: {
          isMale: true,
          isFemale: false
        },
        sexOptions: [
          {
            label: '男',
            value: 'M',
          },
          {
            label: '女',
            value: 'F'
          }
        ],
        userInfo: {
          avatar: '/static/images/avatar.png',
          nickname: '',
          birthday: '',
          mobile: '',
          email: '',
          sex: ''
        },
        uploadUrl: ''
      }
    },
    components: {
      VCell,
      VDatePicker,
      VRadio,
      VueCoreImageUpload,
      'v-lazy': Lazyload
    },
    created(){
        this.fetchData()
    },
    methods: {
      fetchData(){
        this.$http.get(`${this.$apihost}/user`)
          .then((res) => {
            this.userInfo = res
            if(this.userInfo.sex === 'M' || this.userInfo.sex === null){
              this.sex.isMale = true
              this.sex.isFemale = false
            }else{
              this.sex.isMale = false
              this.sex.isFemale = true
            }
          })
      },
      // 保存信息
      save(){
          this.$validator.validateAll().then((res) => {
              if(res){
                  this.$http.post(`${this.$apihost}/user`,{
                    nickname: this.userInfo.nickname,
                    sex: this.userInfo.sex,
                    birthday: this.userInfo.birthday,
                    email: this.userInfo.email
                  })
                    .then((res) => {
                      if(res){
                        Toast.success('保存成功')
                        setTimeout(() => {
                          this.$router.push('/my')
                        },1000)
                      }
                    })
              }
          })
      },
      // 改变头像
      changeImg(res){
        console.log('change')
        this.userInfo.avatar = res
        console.log(this.userInfo.avatar)
      },
      // 上传头像
      uploadImg(res){
        console.log('upload')
        this.userInfo.avatar = res.src
        console.log(res)
      }
    },
    computed: {
      // 最小可选择日期
      startDate(){
        const date = moment([1920,0,1])
        return date.toDate()
      },
      // 最大日期默认今天
      endDate(){
        const date = moment()
        return date.toDate()
      }
    },
    watch: {
      userInfo: function () {
        if(this.userInfo.sex === 'M'){
          this.sex.isMale = true
          this.sex.isFemale = false
        }else{
          this.sex.isMale = false
          this.sex.isFemale = true
        }
      }
    }
  }
</script>
