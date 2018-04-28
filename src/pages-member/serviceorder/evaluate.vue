<style scoped type="text/scss" lang="scss">
  @import "~variables";

  .top{
    display: flex;

    .orderImg{
      flex: 1;

      div {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        background-size: cover;
      }
    }
    .orderInfo{
      flex: 3;

      h2{
        font-size: $font-size-m;
        font-weight: normal;
      }
    }
  }
  .service{
    .serviceInfo{
      width: 100%;
      text-align: center;

      img{
        width: 82px;
        height: 82px;
        border: 3px solid #bfe9f3;
      }
    }
  }
</style>
<template>
  <app-view :has-footer="true">
    <div class="top bg-white padding-m">
      <div class="orderImg">
        <div :style="{ 'backgroundImage': `url(${$filters.img(orderInfo.productImage)})` }"
             class="border-radius border"></div>
      </div>
      <div class="orderInfo margin-left-m">
        <h2>{{ orderInfo.productName ? orderInfo.productName : '无产品名称' }}</h2>
        <p>服务类型：{{ orderInfo.shopServiceName ? orderInfo.shopServiceName : '无服务类型名称' }}</p>
        <p>订单编号：{{ orderInfo.orderId ? orderInfo.orderId : '无订单编号' }}</p>
      </div>
    </div>
    <div class="service bg-white margin-top padding-m">
      <div class="serviceInfo">
        <img v-lazy="$filters.avatar(orderInfo.assignee ? orderInfo.assignee.avatar : '')" class="img-circle">
        <p class="margin-top margin-bottom font-m font-bold-500">{{ orderInfo.assignee && orderInfo.assignee.name ? orderInfo.assignee.name : '无工单负责人姓名' }}</p>
        <div class="padding-m border-top border-bottom">
          <div class="font-default">为服务人员打分</div>
          <star-rating :star-size="20"
                       active-color="#ffc64b"
                       :rating="rating"
                       :show-rating="false"
                       :inline="true"
                       class="margin-top"
                       @rating-selected="ratingSelected"></star-rating>
        </div>
        <v-input type="textarea"
                 rows="4"
                 v-model="evaluateContent"
                 placeholder="写下您对服务的评价吧~"
                 name="evaluateContent"
                 @input="evaluateContents"
                 class="evaluateContents margin-top-m"></v-input>
      </div>
    </div>
    <div class="footer" slot="footer">
      <button type="button" class="btn btn-block btn-primary" @click="commitEvaluate()">提交评价</button>
    </div>
  </app-view>
</template>
<script>
  import types from '@/store/types'
  import StarRating from 'vue-star-rating'
  import VInput from '@/components/ui/v-input'

  export default {
    name: 'evaluate',
    data () {
      return {
        orderInfo: {},
        // 星级数
        rating: 5,
        // 评价内容
        evaluateContent: ''
      }
    },
    computed: {
      curUser () {
        return this.$store.getters[types.oauth.getCurUser]
      }
    },
    components: {
      StarRating,
      VInput,
    },
    created(){
      this.fetch()
    },
    methods: {
      fetch() {
        let _data = this.$route.query && this.$route.query.order;
        if(_data && _data !== '{}') {
          this.orderInfo = JSON.parse(decodeURIComponent(_data));
        }
      },
      /**
       * 星级选择
       * @param val
       */
      ratingSelected(val) {
        this.rating = val
      },
      /**
       * 填写评价
       * @param val
       */
      evaluateContents(val){
        this.evaluateContent = val
      },
      /**
       * 提交评价
       * @returns {boolean}
       */
      commitEvaluate() {
        let that = this;
        if(!that.evaluateContent) {
          that.$toast.error('不要吝啬您的文字，给服务人员说点什么吧')
          return false
        } else {
          that.$dlg.confirm("确定提交评价？", () => {
            that.$http.post(`${that.$apihost}/serviceorders/${that.$route.params.id}/rating`,{
              rating: that.rating,
              review: that.evaluateContent
            })
              .then((res) => {
                if(res){
                  that.$messenger.success('提交成功')
                  setTimeout(() => {
                    that.$store.state.refresh = true;
                    that.$router.push({
                      path: `/serviceorder`,
                      query: {
                        id: ''
                      }
                    })
                  },500)
                }
              })
          });
        }
      }
    }
  }
</script>
