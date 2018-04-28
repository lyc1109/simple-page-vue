<style lang="scss" scoped>
  @import "~variables";
  input[type="radio"] , i::before {
    content: "\a0"; /*不换行空格*/
    display: inline-block;
    vertical-align: middle;
    font-size: 18px;
    width: .8em;
    height: .8em;
    margin-right: .2em;
    border-radius: 50%;
    border: 1px solid $primary;
    text-indent: .15em;
    line-height: 1; 
  }
  input[type="radio"]:checked, .i::before {
    background-color: $primary;
    background-clip: content-box;
    margin-right: 0.1em;
    padding: .1em;
  }
  input[type="radio"] {
    position: absolute;
    right: 0;
    clip: rect(0, 0, 0, 0);
  }
  .each-choice{
    display: flex;
    justify-content: space-between;
    padding: 10px 5px 10px 15px;
    label{
      font-size: 16px;
    }
  }
  .my-btn{
    margin-top: 20px;
    text-align: center;
    padding: 10px 0;
    font-size: rem(16px);
  }
  .each-day{
    margin: 20px 0;
    .day{
      display: flex;
      padding: 10px 20px;    
      list-style: none;
      justify-content: space-between;
      font-size: 16px;
    }
  }
  .my-btn{
    text-align: center;
    padding: 10px 0;
    font-size: rem(16px);
  }
  .right{
    color:orange;
  }
</style>
<template>
  <div id="v-repeat-model">
    <v-popup title="重复模式" position="bottom" v-model="value">
      <li class="each-choice" v-for="(it, id) in chooseList" :key="id" @click="changeSelect(id)">
        <div>
          <label>{{it}}</label>
          <input type="radio" name="choose" :checked="choose === id" />
        </div>
        <i :class="{i:choose === id}" ></i>
      </li>
      <div class="btn-block btn-primary my-btn" @click="transMode">确 定</div>
    </v-popup>
    <v-popup v-model="value2" title="勾选时间" position="bottom" fullScreen>
      <div class="each-day" >
        <li class="day" v-for="(it, id) in days" :key="id" @click="it.check = !it.check">  
          <div class="left">{{it.val}}</div>
          <div class="right" v-show="it.check">√</div>
        </li>
      </div>
      <div class="btn-block btn-primary my-btn" @click="transData">确 定</div>
    </v-popup>
  </div>
</template>
<script>
import VPopup from "@/components/ui/v-popup";
export default {
  components: {
    VPopup
  },
  props: {
    // name: 输入框name属性
    value: Boolean
  },
  data () {
    return {
      chooseList: [
        '执行一次',
        '每日',
        '工作日',
        '自定义'
      ],
      choose: 2,
      days: [
      {
        val: '周一',
        check: true
      }, {
        val: '周二',
        check: true
      }, {
        val: '周三',
        check: true
      }, {
        val: '周四',
        check: true
      }, {
        val: '周五',
        check: true
      }, {
        val: '周六',
        check: false
      }, {
        val: '周日',
        check: false
      }],
      judgeClose: false
    }
  },
  computed: {
    value2: function () {
      return this.choose === 3 && !this.judgeClose
    }
  },
  watch: {
    value: function (newVal) {
      this.$emit("input", newVal);
    }
  },
  methods: {
    changeSelect (id) {
      this.choose = id 
      id === 3 ? this.judgeClose = false : ''
    },
    transData () {
      this.$nextTick(function(){
        let arr = ''
        this.days.filter(function (each) {return each.check}).map(function (each) {arr += each.val + '、'})
        this.$bus.emit('getDays', arr.slice(0, arr.length-1))
        this.judgeClose = true
      })
    },
    transMode () {
      this.value = false 
      this.$nextTick(function(){        
        this.$bus.emit('getMode',this.choose === 3 ? this.chooseList[this.choose].slice(4,-1) : this.chooseList[this.choose])
      })
    }
  },
  mounted () {
    let that = this
    this.$bus.on('getDays', (d) => {
      that.$set(that.chooseList, 3, '自定义(' + d + ')')
      that.transMode()
    })
  }
}
</script>
