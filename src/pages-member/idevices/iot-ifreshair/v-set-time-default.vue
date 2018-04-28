<style lang="scss" scoped>
  @import "~variables";
  #v-set-time-default{
    .card{
      padding:rem(20px) rem(15px);
      margin: 0!important;
      .line2{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .time{
          font-size: rem(30px);
          font-weight: bold;
          line-height: 1.5;
        }
        .mint-switch{
          transform: scale(.8)
        }
      }
    }
    .add-btn{
      min-width: 70vw;
      display: block;
      margin: rem(20px) auto;
      box-sizing: border-box;
      font-size: rem(24px);
      text-align: center;
      text-decoration: none;
      color: #FFFFFF;
      line-height: 1.8;
      border-radius: 5px;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      overflow: hidden;
      color: $primary;
      background-color: #fff;
      border: 1px solid $primary-light;
      border-radius: 99px;
    }
  }
</style>
<style lang="scss">
  #v-set-time-default{
    .cell-swipe .mint-cell-wrapper .mint-cell-value{
      display: block;
      color: #333;
    }
    .mint-cell-swipe{
      margin: 0.76923rem;
    }
    .mint-cell-swipe-button{
      display: table-cell;
      vertical-align: middle;
      line-height: 8rem;
    }
  }
</style>

<template>
  <div id="v-set-time-default">
      <v-cell-swipe :id="idx" :right="[{  
          content: '编辑',  
          style: { background: '#1b9dff', color: '#fff'},  
          handler: () => showTimeDetail(setTimeList[idx])
        }, 
        {  
          content: '删除',  
          style: { background: '#ff7900', color: '#fff'},  
          handler: () => deleteTime(idx, it.id) 
        }]" v-for="(it, idx) in setTimeList" :key="idx" >
        <div class="card">
          <div class="line1">运行时段</div>
          <div class="line2">
            <div class="time">{{it.startHour}}:{{it.startMinute}}-{{it.endHour}}:{{it.endMinute}}</div>
            <x-switch v-model="it.enabled" @onchange="onTime(it.enabled,it.id)"  :id="it.id"></x-switch>
          </div>
          <div class="line3">{{it.repeatMode}}</div>
        </div>
      </v-cell-swipe>
      
      <button class="add-btn" @click="addNewTime">+</button>
    <v-set-time-popup v-model="addTime"></v-set-time-popup>
  </div>
</template>
<script>
 import XSwitch from "@/components/ui/v-switch"
 import VSetTimePopup from "@/pages-member/idevices/iot-ifreshair/v-set-time-popup"
 import freshairDeviceApi from "@/apis/api-iot-freshairdevice";
 import VCellSwipe from "@/components/ui/v-cell-swipe"
export default {
  components: {
    XSwitch,
    VSetTimePopup,
    VCellSwipe
  },
  props: {
    // name: 输入框name属性
    value: Boolean
  },
   watch: {
    value: function (newVal) {
      this.$emit("input", newVal);
    }
  },
  data () {
    return {
      //路由参数
      deviceEntityId: this.$route.params.deviceEntityId,
      deviceId: this.$route.query.deviceId,
      addTime: false,
      setTimeList: []
    }
  },
  methods: {
    init () {
      let that = this
      freshairDeviceApi.getTimeSettings(this.deviceEntityId)
        .then((resp) => {
          resp.map((each) => {
            each.startMinute < 10 ? each.startMinute = '0' + each.startMinute : ''
            each.endMinute < 10 ? each.endMinute = '0' + each.endMinute : ''
          })
          that.setTimeList = resp
        })
        .catch((err) => {
          tjat.$toast.warn("抱歉，定时设置获取失败。" + err);
        });
    },
    onTime (bol,id) {
      let that = this
      if (!bol) {
        freshairDeviceApi.enableTime(this.deviceEntityId, id)
        .then((resp) => {
          if (resp) {
            that.$toast.success("成功开启定时。"); 
          }
        })
        .catch((err) => {
          that.$toast.warn("抱歉，开启定时设置失败。" + err);          
        })
      } else {
        freshairDeviceApi.disableTime(this.deviceEntityId, id)
        .then((resp) => {
          if (resp) {
            that.$toast.success("成功关闭定时。"); 
          }
        })
        .catch((err) => {
          that.$toast.warn("抱歉，关闭定时设置失败。" + err);          
        })
      }
    },
    deleteTime (idx, id) {
      let that = this
      this.$dlg.confirm("确定删除该定时?", function () {
        freshairDeviceApi.deleteTime(that.deviceEntityId, id)
        .then((resp) => {
          if (resp) {
            that.setTimeList.splice(idx, 1)
            that.$toast.success("成功删除定时。");             
          }
        })
        .catch((err) => {
          that.$toast.warn("抱歉，删除定时设置失败。" + err);          
        })
      });
    },
    addTiming (data) {
      let d = JSON.parse(data)
      let id = d.isEdit ? d.id : -1
      let that = this
      freshairDeviceApi.addOrUpdateTime(this.deviceEntityId, id, data)
        .then((resp) => {
          if (d.isEdit) {
            that.setTimeList.map((each,i) => {
              if (each.id === id) {
                that.$set(that.setTimeList, i, d)
              }
            })
          } else{
            that.setTimeList.push(d)          
          }
        })
        .catch((err) => {
          that.$toast.warn("抱歉，定时设置失败。" + err);          
        })
    },
    addNewTime () {
      this.addTime = true
      this.$bus.emit('addNewTime')
    },
    showTimeDetail (item) {
      item.isEdit = true
      this.addTime = true
      this.$bus.emit('sendAirDetail', JSON.stringify(item))
    },
    judgeDay (mode) {
      let obj = {}
      if (mode.indexOf('每天') !== -1) {
        obj = {
          mon: true,
          tue: true,
          wed: true,
          thu: true,
          fri: true,
          sat: true,
          sun: true
        }
      } else if (mode.indexOf('工作日') !== -1) {
        obj = {
          mon: true,
          tue: true,
          wed: true,
          thu: true,
          fri: true,
          sat: false,
          sun: false
        }
      } else if (mode.indexOf('执行一次') !== -1) {
        let date = new Date().getDay()
        obj = {
          mon: date === 1,
          tue: date === 2,
          wed: date === 3,
          thu: date === 4,
          fri: date === 5,
          sat: date === 6,
          sun: date === 0
        }
      } else {
        obj = {
          mon: mode.indexOf('周一') !== -1,
          tue: mode.indexOf('周二') !== -1,
          wed: mode.indexOf('周三') !== -1,
          thu: mode.indexOf('周四') !== -1,
          fri: mode.indexOf('周五') !== -1,
          sat: mode.indexOf('周六') !== -1,
          sun: mode.indexOf('周日') !== -1
        }
      }
      return obj
    }
  },
  mounted () {
    this.$bus.on('getAirDetail', (d) => {
      let obj = this.judgeDay(d)
      d = JSON.parse(d)
      obj.startMinute = Number(d.start.split(':')[1])
      if (obj.startMinute < 10) {
        obj.startMinute = '0' + obj.startMinute
      }
      obj.startHour = Number(d.start.split(':')[0])
      obj.endMinute = Number(d.end.split(':')[1])
      if (obj.endMinute < 10) {
        obj.endMinute = '0' + obj.endMinute
      }
      obj.endHour = Number(d.end.split(':')[0])
      obj.repeatMode = d.mode
      obj.enabled = false
      // ...
      obj.isEdit = d.isEdit
      // 编辑新时间赋值id
      if (obj.isEdit) {
        obj.id = d.id
      }
      this.addTiming(JSON.stringify(obj))
    })
  },
  created () {
    this.init()
  }
}
</script>
