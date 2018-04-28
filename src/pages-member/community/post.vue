<style scoped lang="scss" type="text/scss">
  @import "~variables";


  .post-btn {
    color: $white;
    background: $primary;
    width: 100%;
    height: 100%;
    justify-content: center;
  }
</style>

<template>
  <div>
    <app-view :hasFooter="true">
      <div class="post-box">
        <!--<v-input type="text" class="form-field required padding-left-m padding-right-m bg-white" name="postTitle" label="帖子标题" placeholder="请输入标题"-->
                 <!--v-model.trim="postTitle"-->
                 <!--v-validate="'required'"-->
                 <!--data-vv-as="帖子标题"-->
                 <!--:error-msg="errors.first('postTitle')">-->
        <!--</v-input>-->
        <v-input type="textarea" class="form-field padding-m bg-white" name="postText" placeholder="这一刻想说的话..."
                 rows="10"
                 v-model.trim="postText"
                 :error-msg="errors.first('postText')"></v-input>
        <div class="bg-white margin-top">
          <div class="font-light padding-m border-bottom">封面图片</div>
          <div class="margin-left-m square-uploadimg">
            <v-image className="img-item"
                     btnText="十"
                     :crop="false"
                     :changeImg="imagechanged"
                     :delImg="deleteImg"
                     errorTips="请选择图片"
                     :uploadImg="uploadImg"
                     :uploadErr="uploadErr"
                     :isOnly="true"></v-image>
          </div>
        </div>
      </div>
      <div slot="footer" class="post-btn valign-center font-m" @click="post()">
        发布
      </div>
    </app-view>
  </div>
</template>

<script>
  import AppPage from '@/components/layouts/app-page';
  import types from "@/store/types";
  import VImage from '@/components/ui/v-image';

  import sysApi from "@/apis/api-sys";

  export default{
    name: "community-post",
    data: function () {
      return {
        // 发布内容
        postText: '',
        // 发布标题
        postTitle: '',
        // 是否发布中
        postFlag: true,
        // 发票图片
        imgArr: [],
        // 图片上传成功后服务器返回的数据
        imgEntity: {}
      };
    },
    created() {
      this.$store.commit("hideLoading");
    },
    computed: {
      curUser() {
        return this.$store.getters[types.oauth.getCurUser];
      },
      shopid() {
        return this.$route.params.shopId;
      }
    },
    methods: {
      /**
       * 成功上传图片回调
       */
      uploadImg(res) {
        let _temp = res && res[0];
        this.imgEntity = _temp;
      },
      /**
       * 上传图片失败回调
       */
      uploadErr(res) {
        this.$toast.error('上传图片失败');
      },
      /**
       * 选择图片
       * @param res
       */
      imagechanged(res) {
        let that = this;
        let _uploadTemp = [];
        let _temp = res && res.curImg;

        that.imgArr = res && res.imgBase64;
        _uploadTemp.push(_temp);

        setTimeout(function() {
          that.$bus.emit('upload-img', _uploadTemp);
        },500);
      },
      /**
       * 删除图片
       * @param index
       */
      deleteImg(index) {
        this.imgArr.splice(index,1);
        this.$bus.emit('delete-img', index);
      },
      /**
       * 展示大图
       * @param index
       */
      showImg(index) {
        this.$bus.emit('show-img',{
          imgIndex: index
        });
      },
      /**
       * 发布文章
       */
      post() {
        let that = this;
        if(!that.postText) {
          that.$messenger.error('请输入要发的内容！');
          return;
        }
        that.$http.get(`${that.$apihost}/community/category/list`,{
          tenantId: that.shopid
        })
          .then((category) => {
            if(category && category[0]) {
              let _text = that.postText;
              let reg = new RegExp(/\n/g);
              let _html = _text.replace(reg,"<br>");
              let _params = {
                "categoryIds": category[0] && category[0].id,
                "content": _html,
                "coverImageId": that.imgEntity && that.imgEntity.id,
                "essence": 0,
                "tenantId": that.shopid,
                "title": _text.length > 50 ? _text.substr(0,49) : _text,
                "top": 0,
                "userId": that.curUser.id
              }
              that.$http.post(`${that.$apihost}/community/topic`,{},true,_params)
                .then(() => {
                  that.$messenger.success('发布成功！');
                  that.postFlag = false;
                  setTimeout(() => {
                    that.$utils.loctnHref(`/community/shop_${that.shopid}/index`);
                  },2000);
                })
                .catch(() => {
                  that.postFlag = false;
                })
            }
          })
      }
    },
    beforeRouteLeave(to,from,next) {
      let that = this;
      if(that.postText.trim() && that.postFlag) {
        this.$dlg.confirm("是否放弃编辑文章?", function () {
          next();
        });
      } else {
        next();
      }
    },
    components: {
      AppPage,
      VImage
    }
  };
</script>
