<style lang="scss" scoped>
  @import "~variables";
  #set-time-popup{
    padding: 0 20px;
    .pick{
      padding: 10px 20px;
      margin-top: 20px;
    }
    .mint-cell-wrapper{
      justify-content: space-between;
    }
    .mint-cell-title{
      flex:0 0 rem(70px);
      line-height: 1.4;
      font-size: rem(16px);
      padding-top: 0;
      // flex-basis: rem(80px);
    }
    .mint-cell-value{
      flex:0 0 rem(240px);      
    }
  }
  .time{
    display: flex;
    justify-content: center;
    width: 80%;
    margin: 0 auto;
    .each-time{
      text-align: center;
      font-size: 32px;
      width: 30%;
      div{
        font-weight: bold;
        margin-bottom: -20px;
      }
      span{
        color:#ccc;
        font-size: 15px;
      }
    }
  }
  #canvas{
    display: block;
    margin: rem(20px) auto ;
  }
  .my-btn{
    text-align: center;
    padding: rem(10px) 0;
    font-size: rem(16px);
    position: fixed;
    bottom: 0;
  }
  .mint-cell-value span{
    padding:rem(10px) rem(20px) rem(10px) 0;
    display: inline-block;
    max-width: rem(220px);
    text-align: right;
  }
</style>
<template>
  <div id="set-time-popup">
    <v-popup v-model="value"  position="bottom" :fullScreen="true" title="设置">
      <div class="pick"  @click="changeDay = true">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text">{{label}}</span>
          </div>
          <div class="mint-cell-value">
            <span class="text-wrapper70">{{name}}</span>
            <i class="fa fa-angle-down font-lighter"></i>
          </div>
        </div>
      </div>
      <div class="time">
        <div class="each-time">
          <div>{{start}}</div>
          <span>开启时间</span>
        </div>
        <div class="each-time">-</div>
        <div class="each-time">
          <div>{{end}}</div>
          <span>关闭时间</span>
        </div>
      </div>
      <canvas id='canvas' width='300' height='300'  style='width:300px;height:300px'></canvas>
      <div class="btn-block btn-primary my-btn" @click="transData">确 定</div>
    </v-popup>
    <v-repeat-model v-model="changeDay"></v-repeat-model>
  </div>
</template>

<script>
import VPopup from "@/components/ui/v-popup";
import VClock from "@/assets/scripts/v-clock.js"
import VRepeatModel from "./v-repeat-model"
export default {
  name: "v-set-time-popup",
  components: {VPopup, VRepeatModel},
  props: {
    // 用于控制显示隐藏popup
    value: Boolean,
    name: {
      String,
      default: '工作日'
    },
    // label: 字段文本
    label: {
      type: String,
      default: '重复时间'
    }
    // placeholder: 选择框默认显示内容
  },
  watch: {
    value: function (newVal) {
      if (!newVal) {
       // 观察内存占用多就操作remove
      }
      this.$emit("input", newVal);
    }
  },
  data () {
    return {
      start: '12:00',
      end: '18:00',
      changeDay: false,
      edit: false,
      editId: null,
      canvasObj: null,
    }
  },
  mounted () {
    let that = this
    // 模式
    that.$bus.on('getMode',(d) => {
      that.name = d.length === 20 ? '每天' : d
    })
    var canvasId = document.getElementById('canvas')
    that.$bus.on('addNewTime', () => {
      that.start = '12:00'
      that.end = '18:00'
    that.canvasObj = new VClock({
        // 必传参数,注意此处必须传原生对象，不能是jQuery对象
        canvasByZM: document.getElementById('canvas'),
        vue: that,
        startBtnTime: that.start,
        endBtnTime: that.end
      })
    })
    // 获取time列表的具体time传值
    that.$bus.on('sendAirDetail',(d) => {
      d = JSON.parse(d)
      if (d.isEdit) {
        that.edit = d.isEdit
        that.editId = d.id
      }
      that.name = d.repeatMode
      that.start = d.startHour + ':' + d.startMinute
      that.end = d.endHour + ':' + d.endMinute       

      that.canvasObj = new VClock({
        // 必传参数,注意此处必须传原生对象，不能是jQuery对象
        canvasByZM: canvasId,
        vue: that,
        startBtnTime: that.start,
        endBtnTime: that.end
      })
    })
    
  },
  methods: {
    transData () {
      this.value = false
      this.$nextTick(function(){
        let obj = {}
        obj.mode = this.name
        obj.start = this.start
        obj.end = this.end
        // ..
        obj.isEdit = this.edit
        obj.id = this.editId
        this.$bus.emit('getAirDetail', JSON.stringify(obj))
      })
    }
  }
}
</script>
