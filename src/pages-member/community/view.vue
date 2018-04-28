<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .article-content {
    .img-cover {
      width: 100%;
    }
    .content-box {
      line-height: 1.5;
    }
  }
  .reply-box {
    @include border(bottom);
    &:last-child {
      border-bottom: none;
    }
  }
  .reply-input {
    width: 100%;
    border: none;
    @include border(bottom);
    &:focus {
      border-bottom: rem(1px) solid lighten($primary, 25%);
    }
  }
  .reply-other {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: rgba(0,0,0,.3);
    justify-content: center;
  }
</style>
<template>
  <div>
    <app-view>
      <div class="article-box margin-bottom-xxl">
        <!--帖子主体-->
        <div class="article-header padding-m bg-white">
          <div class="article-title">
            <div class="font-l font-bold-500 text-wrapper-2line">{{ entity && entity.title ? entity.title : '' }}</div>
            <div class="margin-top font-s font-lighter">
              <span>{{ $filters.formatDate( entity.createdAt ? entity.createdAt : (entity.created ? entity.created : '' )) }}</span>
              <span class="margin-left-m">{{ entity.userName ? entity.userName : '' }}</span>
            </div>
          </div>
          <div class="article-content margin-top-m">
            <img class="img-cover"
                 v-if="entity.coverImage || entity.coverImagePath"
                 v-lazy="$filters.img(entity.coverImage ? entity.coverImage : (entity.coverImagePath ? entity.coverImagePath : '') ,'@160h_300w_1e_1c')" alt="">
            <div class="margin-top content-box" v-html="entity && entity.content">{{ entity && entity.content }}</div>
          </div>
          <div class="article-other margin-top-m flex font-lighter font-s" v-if="!type">
            <div class="flex-item">
              <span>阅读  {{ entity && entity.hits ? entity.hits : 0 }}</span>
              <span class="margin-left" @click="like(entity.id)">
                <i class="iconfont font-default font-lighter"
                   :class="{'icon-dz': hasLikeData[entity.id] === 0 ,'icon-dz-1': hasLikeData[entity.id] === 1}"></i>
                {{ likeData[entity.id] ? likeData[entity.id] : 0 }}
              </span>
            </div>
            <span @click="report(entity.id)">举报</span>
            <span class="margin-left" @click="follow()">
              <i class="iconfont font-s font-lighter"
                 :class="{'icon-sc': hasFollowed === 0,'icon-sc-1': hasFollowed === 1}"></i>   关注
            </span>
          </div>
        </div>
        <div class="article-footer margin-top bg-white" v-if="!type">
          <div class="flex valign-center padding-m" style="justify-content: center">
            <div class="border-bottom" style="width: 30px;"></div>
            <span class="margin-left-m margin-right-m">热门跟帖</span>
            <div class="border-bottom" style="width: 30px;"></div>
          </div>
          <div class="article-comment">
            <!--父级评论-->
            <div v-if="replyData && replyData.length > 0"
                 v-for="reply in replyData" class="flex reply-box"
                 style="align-items: flex-start;"
                 @click.stop="del(reply.id)">
              <div class="padding-m padding-right-zero">
                <img :src="$filters.avatar(reply.ownerAvatar)" class="border-radius-circle" alt="" width="40" height="40">
              </div>
              <div class="reply-content padding-m padding-left flex-item">
                <div class="reply-header flex">
                  <div class="text-wrapper flex-item">{{ reply.ownerName ? reply.ownerName : 'null' }}</div>
                  <div class="margin-left-m flex valign-center" style="min-width: 20px;" @click.stop="like(reply.id, 'REP')">
                    <div class="flex-item"></div>
                    {{ likeData[reply.id] }}
                    <!--{{ reply.likes ? reply.likes : 0 }}-->
                    <i class="iconfont font-default margin-left-s font-lighter"
                       :class="{'icon-dz': hasLikeData[reply.id] === 0 ,'icon-dz-1': hasLikeData[reply.id] > 0}"></i>
                  </div>
                </div>
                <div class="text-wrapper font-s font-lighter">{{ $filters.formatDate(reply.created) }}</div>
                <div class="margin-top-m">
                  <div class="text-line">
                    {{ $filters.unEscape(reply.reply ? reply.reply : '') }}
                  </div>

                  <!--子级评论-->
                  <div v-if="reply.childTopicReplyDtos && reply.childTopicReplyDtos.length > 0"
                       v-for="child in reply.childTopicReplyDtos" class="flex margin-top-m border-top padding-top-m" style="align-items: flex-start;">
                    <div class="">
                      <img :src="$filters.avatar(child.ownerAvatar)" class="border-radius-circle" alt="" width="40" height="40">
                    </div>
                    <div class="comment-box padding-left flex-item">
                      <div class="reply-header flex">
                        <div class="text-wrapper flex-item">{{ child.ownerName ? child.ownerName : 'null' }}</div>
                        <div class="margin-left-m flex" style="min-width: 20px;" @click.stop="like(child.id, 'REP')">
                          <div class="flex-item"></div>
                          {{ likeData[child.id] }}
                          <!--{{ reply.likes ? reply.likes : 0 }}-->
                          <i class="iconfont font-s margin-left-s font-lighter"
                             :class="{'icon-dz': hasLikeData[reply.id] === 0 ,'icon-dz-1': hasLikeData[child.id] > 0}"></i>
                        </div>
                      </div>
                      <div class="text-wrapper font-s font-lighter">{{ $filters.formatDate(child.created) }}</div>
                      <div class="margin-top-m">
                        <div class="text-line">
                          {{ $filters.unEscape(child.reply ? child.reply : '') }}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div v-if="!replyData || replyData.length === 0" class="padding-m align-center">
              暂无评论哟~
            </div>
            <!--暂不开发深级别操作-->
            <!--<div class="reply-other flex valign-center" style="display:none;">
              <div class="bg-white border-radius padding-l">
                <div class="flex">
                  <div>
                    <i class="iconfont font-s font-light"></i>
                    <span class="margin-left-s">回复</span>
                  </div>
                  <div>
                    <i class="iconfont font-s font-light"></i>
                    <span class="margin-left-s">分享</span>
                  </div>
                  <div>
                    <i class="iconfont font-s font-light"></i>
                    <span class="margin-left-s">0</span>
                  </div>
                </div>
                <div class="flex">
                  <div>
                    <i class="iconfont font-s font-light"></i>
                    <span class="margin-left-s">收藏</span>
                  </div>
                  <div><i class="iconfont font-s font-light"></i>
                    <span class="margin-left-s">复制</span>
                  </div>
                  <div><i class="iconfont font-s font-light"></i>
                    <span class="margin-left-s">举报</span>
                  </div>
                </div>
              </div>
            </div>-->
          </div>
        </div>
      </div>
      <div class="padding-top-m"></div>
      <!-- 按钮 -->
      <div class="border-top page-footer padding-m flex" v-if="!type">
        <div class="flex-item">
          <input type="text" placeholder="评论..." v-model="replyText" class="padding-s reply-input">
        </div>
        <i class="margin-left-m iconfont icon-fs font-lighter" :class="{ 'color-primary': replyText.length > 0 }" @click="reply()"></i>
      </div>
    </app-view>
  </div>
</template>

<script>
  import AppPage from '@/components/layouts/app-page';
  import types from "@/store/types";

  export default{
    name: "community-detail",
    data: function () {
      return {
        // 帖子实体对象
        entity: {},
        // 帖子回复数据
        replyData: {},
        // 帖子点赞数据
        likeData: [],
        // 是否点赞
        hasLikeData: [],
        // 回复内容
        replyText: '',
        // 是否关注
        hasFollowed: 0,
        // 文章类型
        type: this.$route.query && this.$route.query.type,
        // 宣传内容
        notice: {
          title: '每天四个时刻必须喝水，如何喝水最养生?',
          created: 1488672000,
          content: '<div class="rich_media_content " id="js_content"><section class="" style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(62, 62, 62); white-space: normal; line-height: 25.6000003814697px; font-family: 微软雅黑; background-color: rgb(255, 255, 255); box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="44423" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 10px 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; text-align: center;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(255, 255, 255); font-size: 18px;"><strong style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"><span class="" data-bcless="darken" data-brushtype="text" style="margin: 0px 7px 11px 0px; padding: 5px 10px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; border-bottom-width: 4px; border-bottom-style: solid; border-color: rgb(78, 192, 255); border-top-left-radius: 3px; border-top-right-radius: 3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; line-height: 36px; color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-size: 14px;">每天四个时刻必须来杯水</span></span></strong></span></section></section><section class="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">1</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;">第一杯水6:00AM</span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1019/51204fb6f9b5bd50e5ddcd1f76370a6b.png!q70"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">清晨第一杯水经过一整夜的睡眠,身体开始缺水,起床后喝250ml的水,既可以补充一夜消耗的水分,又可以帮助肾脏及肝脏排毒。有人说早上起来应该喝淡盐水,也有人习惯喝一杯蜂蜜水,但是专家的观点认为,早晨是人体血压升高的第一个高峰,喝淡盐水会使血压更高；而喝蜂蜜水则会引起胃酸。所以,新鲜的温白开水是最好的选择,其中所含的钙、镁元素对身体健康很有益。注意,喝水时最好小口小口喝,这样水更容易被肠胃吸收。</span></p></section></section><p style=""><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></p><p></p><section class="" style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(62, 62, 62); white-space: normal; line-height: 25.6000003814697px; font-family: 微软雅黑; background-color: rgb(255, 255, 255); box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">2</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;">第二杯水9:00AM</span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1022/1796451b0bfa10125bc65ea6f0b9a2ab.png!q70"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">清晨从起床到办公室的过程,时间总是特别紧凑,情绪也较紧张,身体无形中会出现脱水现象,所以到了办公室后,先别急着泡咖啡或者茶,给自己倒一杯清水,适时地为身体补充水分,然后开始一天的工作吧!</span></p></section><p></p><p style=""><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></p><p></p><section class="" style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(62, 62, 62); white-space: normal; line-height: 25.6000003814697px; font-family: 微软雅黑; background-color: rgb(255, 255, 255); box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">3</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;">第三杯水11:00AM</span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;"><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1024/e56b4919b2e7f5767af41045f1f8a658.png!q70"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">在办公室工作一段时间后,一定别忘了起身活动活动,同时给身体补充流失的水分,一杯清水或者一杯蔬菜汁,都有助于放松你紧张的工作情绪。</span></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></span></p></section><section class="" style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(62, 62, 62); white-space: normal; line-height: 25.6000003814697px; font-family: 微软雅黑; background-color: rgb(255, 255, 255); box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">4</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;">第四杯水18:00PM</span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1025/4c170c0eaac06ed59b35f451582122c4.png!q70"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">离开办公室前最好能再补充一杯清水,以缓解下班路途中的缺水现象。</span></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-size: 14px; font-family: sans-serif;"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></span></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; text-align: center; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-size: 14px; font-family: sans-serif;"><strong style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(255, 255, 255); font-family: 微软雅黑; font-size: 18px;"><span class="" data-bcless="darken" data-brushtype="text" style="margin: 0px 7px 11px 0px; padding: 5px 10px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; border-bottom-width: 4px; border-bottom-style: solid; border-color: rgb(78, 192, 255); border-top-left-radius: 3px; border-top-right-radius: 3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; line-height: 36px; color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-size: 14px;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;">每天如何喝水最养生</span></span></span></strong></span></p></section><section class="" style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(62, 62, 62); white-space: normal; line-height: 25.6000003814697px; font-family: 微软雅黑; background-color: rgb(255, 255, 255); box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">1</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;">饮水量要适当</span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;"><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1026/91739e277a963bce12cf4485020b3e1e.png!q70"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">正常人每天清水的摄入量为2000ml~2500ml。太少,体内废物代谢不出去,影响身体健康；太多,则会加重肾脏负担,也非常不可取。</span></p></section><p></p><p style=""><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></p><p></p><section class="" style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(62, 62, 62); white-space: normal; line-height: 25.6000003814697px; font-family: 微软雅黑; background-color: rgb(255, 255, 255); box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">2</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;">早晨第一杯水喝什么</span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;"><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1026/16147c428728e0817f3c891dd7976442.png!q70"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">许多人把起床后饮水视为每日的功课,图它润肠通便,降低血粘度,让整个人看上去水灵灵的。但早晨这第一杯水却不能乱喝。牛奶、碳酸饮料、果汁、冷水以及盐水、菜汤、肉汤都不合适作为早上第一杯水饮用。温开水或温水冲调的蜂蜜比较合适早上起床后饮用。</span></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></p><section class="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">3</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;">餐前半小时补水最养胃</span></span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-size: 14px; font-family: sans-serif;"><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1027/832513ab11ebfa7a1a27d8fa7f42be97.png!q70"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">吃饭前半小时补水,既不会冲淡胃液影响消化,还会调动食欲,调节体内无机盐浓度,减轻饭后盐分摄入过多引起的体渴。</span></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-size: 14px; font-family: sans-serif;"></span></p><section class="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">4</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;">绿茶保健康</span></span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-size: 14px; font-family: sans-serif;"><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1028/6fb4b41c62e1d90d3d656140549a2a89.png!q70"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">下午两三点的时候,最好冲一杯绿茶给自己,即提神醒脑,又能抵抗辐射。这里说的绿茶是茶叶冲的,不是市场上卖的茶饮料。要知道,茶饮料里茶的成分非常少,含糖量却非常高,经常饮用对体重有很大影响,听说过有人因为暴饮甜饮料而罹患糖尿病的不幸遭遇呢。</span></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></p><section class="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">5</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;">识破“花样”水</span></span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-size: 14px; font-family: sans-serif;"><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1028/ff378537e8643bcb6e95db8113d3af41.png!q70"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">纯净水,经多重过滤去除了各种微生物、杂质和有益的矿物质,突出的是饮用的安全性,它是一种软水,许多人认为它不够营养,长期饮用不利健康,可是这种观点未被证实。</span></p></section></section></section></section><p></p><p style=""><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></p><p style=""><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; font-size: 14px; color: rgb(89, 89, 89);">矿泉水,是种自然资源,由地层深处开采出来,含有丰富的稀有矿物质,略呈碱性,应该更有利于健康,但是不排除有机物污染的可能。</span></p><p style=""><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; font-size: 14px; color: rgb(89, 89, 89);">矿物质水,在纯净水中按照人体浓度比例添加矿物质浓缩液配制而成的人工矿泉水,标志着饮用水科技的新高度。</span></p><p style=""><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></p><p></p><section class="" style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(62, 62, 62); white-space: normal; line-height: 25.6000003814697px; font-family: 微软雅黑; background-color: rgb(255, 255, 255); box-sizing: border-box !important; word-wrap: break-word !important;"><section class="" data-id="45" data-color="rgb(182, 228, 253)" data-custom="rgb(182, 228, 253)" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; border: 0px none;"><section style="margin: 0.8em 0px 0.5em; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; line-height: 32px; font-weight: bold;"><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: inline-block; float: left; width: 32px; height: 32px; border-top-left-radius: 32px; border-top-right-radius: 32px; border-bottom-right-radius: 32px; border-bottom-left-radius: 32px; vertical-align: top; text-align: center; border-color: rgb(182, 228, 253); color: rgb(5, 115, 175); background-color: rgb(182, 228, 253);"><section data-width="100%" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table; width: 31.1111125946045px; color: inherit; border-color: rgb(182, 228, 253);"><section class="" placeholder="1" data-original-title="" title="" style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; display: table-cell; vertical-align: middle; color: rgb(255, 255, 255); border-color: rgb(182, 228, 253);">6</section></section></section><section class="" data-brushtype="text" style="margin: 0px 0px 0px 36px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; color: rgb(5, 115, 175); border-color: rgb(182, 228, 253);"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px; line-height: normal;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;">运动后要补水</span></span></section></section><section style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box; word-wrap: break-word !important; width: 0px; height: 0px; clear: both;"></section></section><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; max-width: 100%; min-height: 1em; white-space: pre-wrap; box-sizing: border-box !important; word-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-size: 14px; font-family: sans-serif;"><img src="http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1029/8a502bf9f3ee1f377727d41f30f06530.png!q70"><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></span><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; color: rgb(89, 89, 89); font-family: sans-serif; font-size: 14px;">运动后体内极容易缺水,所以一定要补水。补水要掌握以下原则:</span></p></section><p></p><p style=""><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></p><p style=""><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; font-size: 14px; color: rgb(89, 89, 89);">a、不能渴时才补。因为感到口渴时,丢失的水分已达体重的2% 。</span></p><p style=""><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; font-size: 14px; color: rgb(89, 89, 89);">b、运动前、中、后都要补水。运动前2小时补250—500毫升；运动前即刻补150—250毫升；运动中每15~20分钟补120—240毫升；运动后按运动中体重的丢失量,体重每下降1千克需补1升。</span></p><p style=""><br style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important;"></p><p style=""><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; word-wrap: break-word !important; font-size: 14px; color: rgb(89, 89, 89);">多多补充水分,秋冬季节更是如此哦。</span></p></div>',
          coverImagePath: 'http://shmedias.oss-cn-shenzhen.aliyuncs.com/dev-medias/vue-test/20171108/1017/e68252d39b6dde4894b5d6ddc8f0268f.jpg',
        }
      };
    },
    created() {
      let that = this;
      this.$store.showLoading = true;
      if(!this.type) {
        this.$http.get(`${this.$apihost}/community/topic/${this.entityId}`, {
          'user_id': this.curUser.id
        })
          .then((res) => {
            this.entity = res;
            document.title = res.title;
//          console.log(res);

            this.$http.get(`${this.$apihost}/community/topic/${this.entityId}/reply`, {
              'operator_id': this.curUser.id
            })
              .then((resReply) => {
                this.replyData = resReply.fileList;

//              if(resReply.totalElements > 0) {
                let _temp = this.replyData;
                for(let i = 0,len = resReply.totalElements; i < len; i++) {
                  this.likeData[_temp[i].id] = _temp[i].likes || 0;
                  this.hasLikeData[_temp[i].id] = _temp[i].hasLike || 0;

                  let _childTemp = _temp[i].childTopicReplyDtos;
                  if(_childTemp) {
                    for(let j = 0, _len = _childTemp.length; j < _len; j++) {
                      this.likeData[_childTemp[j].id] = _childTemp[j].likes || 0;
                      this.hasLikeData[_childTemp[j].id] = _childTemp[j].hasLike || 0;
                    }
                  }
                }
                this.likeData[this.entity.id] = res.likes || 0;
                this.hasLikeData[this.entity.id] = res.hasLike || 0;
                this.hasFollowed = res.hasFollowed || 0;
//              }
              })
          })
      } else if(this.type === 'bulletin') {
        this.$http.get(`${this.$apihost}/bulletin/top`,{
          bulletin_type: 'H'
        }).then((noticeList) => {
          this.$store.commit("hideLoading");
          for(let i in noticeList) {
            if(noticeList[i].id === that.entityId) {
              that.entity = noticeList[i];
              break;
            }
          }
        })
      } else if(this.type === 'notice') {
        this.entity = this.notice;
      }
    },
    computed: {
      // 当前用户
      curUser() {
        return this.$store.getters[types.oauth.getCurUser];
      },
      // 实体id
      entityId() {
        return this.$route.params.id;
      },
      // 店铺id
      shopId() {
        return this.$route.params.shopId;
      }
    },
    methods: {
      /**
       * 点赞
       * @param targetId      目标id
       * @param type  点赞类型[BBS:帖子 | REP:回复]
       */
      like(targetId, type) {
        if(this.hasLikeData[targetId] === 0) {
          let _type = 'BBS';
          let _entityId = this.entityId;
          let _userId = this.curUser.id;

          if(type) {
            _type = type;
          }
          if(targetId) {
            _entityId = targetId;
          }
          this.$http.post(`${this.$apihost}/community/${_entityId}/praise`,{
            'user_id': _userId,
            'type': _type
          })
            .then((res) => {
              this.likeData.splice(_entityId, 1, ++this.likeData[_entityId]);
              this.hasLikeData.splice(_entityId, 1, ++this.hasLikeData[_entityId]);
            })
            .catch((res) => {
              console.log(res);
              return false;
            })
        }
      },
      /*
       * 举报
       * @param targetId      目标id
       * @param type          目标类型[1:帖子 | 2:回复]
       */
      report(targetId, type) {
        console.log(targetId);
        let _targetId = this.entityId;
        let _type = 1;

        if(targetId) {
          _targetId = targetId;
        }
        if(type) {
          _type = type;
        }

        let options = {
          showInput: true,
          showCancelButton: true,
          inputValidator(value) {
            if(value === null || value.replace(/^\s+|\s+$/g,"").length === 0) {
              return "请填写举报原因";
            }
          }
        };

        const that = this;
        that.$dlg.prompt("请输入举报说明", (value) => {
          let _params = {
            'target_id': _targetId,
            'target_type': _type,
            'user_id': that.curUser.id,
            'cause': value
          };

          that.$http.post(`${that.$apihost}/community/report`,_params)
            .then((res) => {
              that.$toast.success('操作成功');
              setTimeout(() => {
                location.reload();
              }, 600);
            })
        })
      },
      /**
       * 关注帖子
       */
      follow() {
        if (this.hasFollowed === 0) {
          this.$http.post(`${this.$apihost}/community/topic/${this.entityId}/followers`,{
            'user_id': this.curUser.id,
            'tenant_id': this.shopId
          })
            .then((res) => {
              this.hasFollowed = Number(!this.hasFollowed);
            })
        }
      },

      /**
       * 回复
       * @param targetId  父级id
       */
      reply(targetId) {
        let _id = '';

        if(targetId) {
          _id = targetId;
        }

        if (this.replyText.trim() !== '') {
          let _params = {
            'reply': this.replyText,
            'user_id': this.curUser.id,
            'tenant_id': this.shopId,
            'parent_id': _id
          }

          this.$http.post(`${this.$apihost}/community/topic/${this.entityId}/reply`,_params)
            .then((res) => {
              this.$toast.success('操作成功');
              setTimeout(() => {
                location.reload();
              }, 500);
            })
        } else {
          this.$messenger.error('请输入评论内容');
        }
      },
      /**
       * 删除回复
       * @param id
       */
      del(id) {
        const that = this;
        that.$dlg.confirm("是否确认删除回复?", () => {
          that.$http.del(`${that.$apihost}/community/reply/${id}/remove`)
            .then((res) => {
              that.$toast.success('删除成功');
              setTimeout(() => {
                location.reload();
              }, 500);
            });
        });
      }
    },
    components: {
      AppPage
    }
  };
</script>
