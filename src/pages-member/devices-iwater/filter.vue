<style lang="scss" type="text/scss" scoped>
  @import "~variables";

  .btn-gray {
    background: $gray;
  }
  .filter-detail{
    .filter-img{
      padding: rem(70px);

      div{
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
        width: 100%;
        padding-bottom: 90%;
        height: 0;
      }
    }
    .filter-info{
      @include border(top);

      .filter-basic{
        @include border(bottom);

        h2{
          font-size: $font-size-l;
          font-weight: normal;
          margin-bottom: 0;
        }
        &>span{
          width: 100%;
          display: block;
          color: #888;
        }
        b{
          color: $primary;
          font-weight: normal;
          font-size: $font-size-l;
          display: inline-block;
          line-height: 40px;
          height: 40px;
        }
      }
    }
  }
  .footer{
    @include border(top);

    .available-date,.available-operate{
      width: 50%;
      float: left;

      .mt-progress{
        height: 15px;
        line-height: 15px;
      }
      &>span{
        color: #999;
      }
    }
    .available-operate{
      text-align: right;
    }
  }
</style>

<template>
  <app-view :has-footer="true" class="bg-white">
    <div class="filter-detail bg-white">
      <div class="filter-img valign-center">
        <div :style="{ backgroundImage: `url(${$filters.img(availableFilter.productImage,'!wh400')})` }"
             v-lazy="$filters.img(availableFilter.productImage,'!wh400')"></div>
      </div>
      <div class="filter-info">
        <div class="filter-basic padding-top padding-bottom padding-left-m padding-right-m">
          <h4>{{ availableFilter.name }}</h4>
          <span class="margin-top-s" v-html="availableFilter.productDesc">{{ availableFilter.productDesc }}</span>
          <!--<b>{{ $filters.formatCurrency(availableFilter.price/100) }}</b>-->
        </div>
        <div class="filter-detail-main padding-left padding-right">
          <v-cell v-for="item in filterList" :key="item.value" :title="item.title" :value="item.value"></v-cell>
        </div>
      </div>
    </div>
    <div class="footer padding" slot="footer">
      <div class="available-date filter-num">
        <mt-progress :value="(availableFilter.value || 0)"
                     :bar-height="10"
                     :class="{ 'greenProgress': Number((availableFilter.value || 0)) >= 70, 'yellowProgress': Number((availableFilter.value || 0)) < 70 && Number((availableFilter.value || 0)) > 30, 'redProgress': Number((availableFilter.value || 0)) <= 30,  }"></mt-progress>
        <span>预计可用  {{ availableFilter.date && Number(availableFilter.date) > 0 ? availableFilter.date + '  天' : '估算中...' }}</span>
      </div>
      <div class="available-operate">
        <button v-if="isShowCancel" type="button" class="btn btn-primary btn-round btn-sm" @click="cancel()">取消</button>
        <button v-else-if="!isShowCancel" type="button"
                class="btn btn-round btn-sm"
                :class="{ 'btn-primary': power === 'true', 'btn-gray': power === 'false' }"
                @click="filterReset()">滤芯复位</button>
      </div>
    </div>
  </app-view>
</template>

<script>
  export default {
    name: 'devices-filter',
    data () {
      return {
        filterList: [
          {
            title: '品牌',
            value: ''
          },
          {
            title: '类型',
            value: ''
          },
          {
            title: '启用日期',
            value: ''
          }
        ],
        availableFilter: {
          value: 60,
          date: 30,
          productImage: '',
          productDesc: '',
          price: 0
        },
        isShowCancel: false,
      }
    },
    computed: {
      power() {
        let _power = 'true';
        if(this.$route.query && this.$route.query.power !== '' && this.$route.query.power !== null&& this.$route.query.power !== undefined) {
          _power = this.$route.query.power.toString();
        }
        return _power;
      }
    },
    created() {
      // 初始化数据
      let that = this;
      let _query = that.$route.query;
      if(_query) {
        that.availableFilter.value = Number(_query.availablePercentage || 0)*100;
        that.availableFilter.date = _query.estimatedDays || 0;
        that.$http.get(`${that.$apihost}/products/${_query.partProductId}`)
          .then((res) => {
            if(res) {
              that.availableFilter.productImage = res.coverImage || '';
              that.availableFilter.name = res.name || '无产品名称';
              that.availableFilter.productDesc = res.productDesc || '无产品描述';
              that.availableFilter.price = res.price || 0;
              that.filterList[0].value = res.bandName || '无'
              that.filterList[1].value = res.productTypeTitle || '无'
              that.filterList[2].value = res.createdTime ? that.$filters.formatDate(res.createdTime) : '无'
            }
          })
      }
    },
    methods: {
      /**
       * 取消复位
       */
      cancel() {
        if(this.power === 'true') {
          this.$dlg.confirm("确定取消滤芯复位?", () => {
            this.$http.post(`${this.$apihost}/waterdevices/${this.$route.params.id}/unresetFilter/${Number(this.$route.query.index) + 1}`)
              .then((res) => {
                this.availableFilter.value = res.availablePercentage;
                this.availableFilter.productImage = res.productImage;
                this.availableFilter.name = res.name;
                this.$messenger.success('已取消复位');
                this.isShowCancel = false;

              })
          });
        }
      },
      /**
       * 滤芯复位
       */
      filterReset() {
        if(this.power === 'true') {
          this.$dlg.confirm("该操作可能会导致滤芯寿命受到影响，是否确认复位?", () => {
            this.$http.post(`${this.$apihost}/waterdevices/${this.$route.params.id}/resetFilter/${Number(this.$route.query.index) + 1}`)
              .then((res) => {
                this.availableFilter.value = res.availablePercentage;
                this.availableFilter.productImage = res.productImage;
                this.availableFilter.name = res.name;
                this.$messenger.success('复位成功');
                this.isShowCancel = true;
                setTimeout(() => {
                  this.$router.go(0)
                }, 500)
              })
          });
        }
      }
    },
  }
</script>
