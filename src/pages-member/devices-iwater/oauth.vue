<style scoped type="text/scss" lang="scss">
  @import "~variables";

  .oauth-manage {
    overflow: hidden;
    .oauth-bg {
      flex: 0 0 16%;
      &>div{
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
    }
    .oauth-list{
      ul{
        display: inline-block;
        width: 100%;

        li{
          display: flex;

          .avatar-box {
            flex: 0 0 16%;
            text-align: center;
            .avatar {
              width: 100%;
              img {
                width: 100%;
                @include border-radius(50%);
              }
              .avatar-info {
                background: $primary;
                width: 100%;
                position: relative;
                z-index: 99;
                margin-top: rem(-10px);
                @include border-radius(20px);
              }
            }
          }
          .info {
            height: 100%;
            flex-direction: column;
            align-items: flex-start;
          }
          .operate-btn {
            text-align: center;
          }
        }
      }
    }
  }
  .add-oauth {
    width: 100%;
    height: 100%;
    background: #fff;
    .title {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
    }
    .oauth-mobile {
      margin-top: rem(50px);
    }
    .btn {
      position: fixed;
      bottom: 0;
      left: 0;
      height: rem(50px);
    }
  }
</style>
<template>
  <app-view :has-footer="true">
    <div class="oauth-manage">
      <div class="oauth-bg">
        <div :style="{ backgroundImage: `url(${$filters.img('/static/images/devices/oauth-bg.jpg','!wh400')})` }" v-lazy="$filters.img('/static/images/devices/oauth-bg.jpg','!wh400')"></div>
      </div>
      <div v-if="oauthList && oauthList.length > 0" class="oauth-list bg-white padding-m">
        <ul>
          <!--授权者-->
          <!--<li class="">-->
            <!--<div class="avatar">-->
              <!--<img v-lazy="$filters.avatar(avatar,'!wh100')">-->
              <!--<i class="avatar-info">拥有者</i>-->
            <!--</div>-->
            <!--<div class="info padding-left-l">-->
              <!--<h3>{{ curUser.nickname }}</h3>-->
              <!--<b>{{ curUser.mobile }}</b>-->
              <!--<span>-->
                <!--<i class="iconfont icon-iot-time margin-right-s"></i>-->
                <!--{{ $filters.formatTime(curUser.joinDate) }}-->
              <!--</span>-->
            <!--</div>-->
          <!--</li>-->
          <!--被授权者-->
          <li class="flex" v-for="item in oauthList" :key="item.name">
            <div class="valign-center avatar-box">
              <div class="avatar">
                <img v-lazy="$filters.avatar(item.userAvatar)">
                <div class="avatar-info font-s color-white align-center">使用者</div>
              </div>
            </div>
            <div class="info flex-item padding-left-m padding-right-m flex">
              <div class="text-wrapper font-m font-bold-500">{{ item.userNick }}</div>
              <div class="font-m font-light flex-item">{{ item.userMobile }}</div>
              <div class="font-s margin-top-s">
                <i class="iconfont icon-iot-clock margin-right-s font-s"></i>
                {{ $filters.formatTime(item.authorizationTime) }}
              </div>
            </div>
            <div class="valign-center" v-if="item.isOauth">
              <button type="button" class="btn btn-sm btn-round btn-primary-outline" @click="relieveOauth(item.id)">解除授权</button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="!oauthList || oauthList.length <= 0"
           class="bg-white padding-l align-center">暂无使用者</div>
    </div>
    <div class="footer" slot="footer">
      <button type="button" class="btn btn-block btn-primary" @click="addOauths()">添加授权</button>
    </div>
    <mt-popup v-model="addOauth" position="bottom" class="add-oauth">
      <slot>
        <div class="title padding-m border bg-yellow-4 flex">
          <span class="font-default flex-item">填写授权人手机号码</span>
          <i class="iconfont icon-iot-guanbi font-light" @click="closeOauth()"></i>
        </div>
        <v-input class="oauth-mobile padding-left-m padding-right-m" type="text"
                 v-model="oauthMobile"
                 label="授权人"
                 name="oauthMobile"
                 placeholder="请填写授权人手机号码"
                 v-validate="'required|mobile'"
                 data-vv-as="手机号码"
                 :error-msg="errors.first('oauthMobile')"></v-input>
        <button type="button" class="btn btn-block btn-primary" @click="addSure()">确定</button>
      </slot>
    </mt-popup>
  </app-view>
</template>
<script>
  import types from '@/store/types'

  export default {
    name: 'devices-oauth',
    data(){
      return {
        oauthList: [],
        addOauth: false,
        oauthMobile: '',
        avatar: '/static/images/avatar.png'
      }
    },
    created(){
      this.fetchData()
    },
    mounted(){
        this.$nextTick(() => {
          window.onpopstate = () => {
            if(window.location.hash.indexOf('oauth') <= -1){
              this.addOauth = false
              this.oauthMobile = ''
            }
          }
        })
    },
    computed: {
      curUser(){
        return this.$store.getters[types.oauth.getCurUser]
      },
      isOwner: function () {
        return false;
      }
    },
    methods: {
      fetchData(){
        this.$http.get(`${this.$apihost}/userdevices/${this.$route.params.id}/authorizations`)
          .then((res) => {
            this.oauthList = res
            this.oauthList.forEach((value,index,array) => {
              value.isOauth = true
            })
          })
      },
      addOauths(){
        this.addOauth = true
        window.location.hash = 'oauth'
      },
      addSure() {
        let that = this;
        let _isRepeat = false;
        let _mobile = this.curUser && this.curUser.mobile;
        let _oauthMobile = this.oauthMobile;
        if(_mobile && _mobile === _oauthMobile) {
          that.$toast.error('不能授权给拥有者！');
        } else {
          let _temp = that.oauthList;
          for(let i = 0,len = _temp.length; i<len; i++) {
            if(_temp[i].userMobile === _oauthMobile) {
              that.$toast.error('不能重复授权！请重新输入手机号');
              _isRepeat = true;
              break;
            }
          }
          if(!_isRepeat) {
            this.$validator.validateAll().then((result) => {
              if(result){
                this.$dlg.confirm("确定授权?", () => {
                  this.$http.post(`${this.$apihost}/userdevices/${this.$route.params.id}/authorization`,
                    {
                      mobile_nos: _oauthMobile
                    })
                    .then((res) => {
                      this.$messenger.success('授权成功')
                      this.addOauth = false
                      this.oauthMobile = ''
                      this.$router.go(-1)
                      this.fetchData()
                    })
                });
              }
            })
          }
        }
      },
      relieveOauth(id){
        this.$dlg.confirm("确定解除授权？", () => {
          this.$http.del(`${this.$apihost}/userdevices/${id}/authorization`)
            .then((res) => {
              if(res){
                this.$messenger.success('解除成功')
                this.fetchData()
              }
            })
        });
      },
      closeOauth(){
        this.addOauth = false;
        this.oauthMobile = '';
        this.$router.go(-1);
      }
    }
  }
</script>
