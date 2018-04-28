<style scoped lang="scss" type="text/scss">
  @import "~variables";

  svg {
    -webkit-transform: rotate(-0.05deg);
    transform: rotate(-0.05deg);
  }
  .clock-item {
    box-shadow: 0 5px 15px -10px #999;
  }
  .btn-add {
    border: 1px solid rgba($primary-light,0.3);
    border-radius: $l;
  }
  .clock-box {
    position: relative;
    padding: 16% 0;
    .clock-time {
      position: absolute;
      width: 100%;
      top: calc(50% - 12px);
    }
    .line-box {
      position: relative;
      margin: 0 auto;
      background: #fff;
      border-radius: 50%;
      border: 1px solid #d6071b;
      .keduxian .keduxian-item {
        position: absolute;
        top: 50%;
        margin:0;
        transform-origin:right top;
      }
      .keduxian p{
        background: #999;
        width: 6px;
        height: 2px;
        border-radius: 0 2px 2px 0;
      }
      .keduxian .pointXian {
        color: #333;
        height: 3px;
      }
      .nmb {
        position: relative;
        width: 100%;
        height: 100%;
      }
      .nmb div {
        position: absolute;
        margin: -6px 0 0 -12px;
        display: block;
        font-weight: bold;
        font-size: 12px;
        transform-origin:right center;
      }
      .nmb1 {
        left: 12%;
        top:51.5%;
      }

      .nmb2 {
        left: calc(50% + 3px);
        top: 12%;
      }

      .nmb3 {
        right: 12%;
        top: 51.5%;
      }

      .nmb4 {
        bottom: 12%;
        left: calc(50% + 9px);
      }
      .nmb div span{
        position: absolute;
        color: #333;
      }
    }
    .container {
      position: absolute;
      top: 3.5px;
      .clock-btn {
        position: absolute;
        width: 10%;
        height: 10%;
        justify-content: center;
        &.clock-open {
          left: 45%;
          top: 5%;
          z-index: 10;
        }
        &.clock-close {
          left: 45%;
          top: 5%;
          z-index: 11;
        }
      }
    }
  }
</style>
<template>
  <div>
    <!--时间列表-->
    <article class="list-container" style="display: none">
      <ul class="padding-m">
        <li class="border border-radius padding-m clock-item">
          <div>运行时段</div>
          <div class="flex margin-top-s margin-bottom-s">
            <div class="flex-item font-xl font-bold-400">12:00-15:00</div>
            <v-switch></v-switch>
          </div>
          <div class="font-lighter">工作日</div>
        </li>
      </ul>
      <div class="ripple align-center font-xl font-bold-500 color-primary margin-m btn-add">+</div>
    </article>
    <article class="clock padding-m" style="display: none1">
      <div class="padding-m bg flex">
        <div class="flex-item">重复模式</div>
        <div>工作日 <i class="iconfont icon-iot-youjiantou1 font-lighter font-s"></i></div>
      </div>
      <div class="margin-m">
        <div class="flex font-bold-500 align-center" style="font-size: 35px">
          <div class="flex-item">12:00</div>
          <div class="flex-item">-</div>
          <div class="flex-item">20:00</div>
        </div>
        <div class="flex font-s font-light align-center">
          <div class="flex-item">开启时间</div>
          <div class="flex-item"></div>
          <div class="flex-item">关闭时间</div>
        </div>
      </div>
      <div class="clock-box">
        <div class="line-box"
             :style="{ 'width': clientWidth*0.69 + 'px','height': clientWidth*0.69 + 'px' }">
          <div class="clock-time font-l font-bold-500 align-center">
            8小时00分
          </div>
          <div class="nmb">
            <div class="nmb1"><span>9</span></div>
            <div class="nmb2"><span>12</span></div>
            <div class="nmb3"><span>3</span></div>
            <div class="nmb4"><span>6</span></div>
          </div>
          <div class="keduxian">
            <div v-for="(item, index) in line"
                 v-if="index%5 === 0"
                 class="keduxian-item"
                 :style="{ 'transform': 'rotate('+index*6+'deg)','width': clientWidth*0.34 + 'px' }">
              <p :class="{ 'pointXian': index%15 === 0 }"></p>
            </div>
          </div>
        </div>
        <div class="container">
          <span class="btn-group" v-if="openBtnP && openBtnP.x && openBtnP.x > 0">
            <!--<span class="clock-btn bg-white font-l border-radius-circle valign-center clock-open"-->
                 <!--:style="{ 'left': openBtnP.x + 'px', 'top': openBtnP.y + 'px' }">开</span>-->
            <span class="clock-btn bg-white font-l border-radius-circle valign-center clock-open">关</span>
            <span class="clock-btn bg-white font-l border-radius-circle valign-center clock-close">关</span>
          </span>
          <svg :width="clientWidth" :height="clientWidth" :VIEWBOX="`0 0 ${clientWidth} ${clientWidth}`">
            <defs>
              <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#ffc600"/>
                <stop offset="100%" stop-color="#5ece0f"/>
              </linearGradient>
            </defs>
            <circle cx="50%" cy="50%" r="40%" stroke-width="12%" stroke="#eee" fill="none" @touchmove="moveCircle"></circle>
            <circle cx="50%" cy="50%" r="40%" stroke-width="12%" stroke="url(#linear)" fill="none" stroke-linecap="round"
                    :stroke-dasharray="dashArray"
                    :transform="`matrix(0,-1,1,0,0,${clientWidth})`"></circle>
          </svg>
        </div>
        <!--<p>拖我：<input id="range" type="range" min="0" max="100" :value="range" style="width:300px;"></p>-->
      </div>
    </article>
    <mt-popup></mt-popup>
  </div>
</template>
<script>
  import vSwitch from '@/components/ui/v-switch';

  export default {
    data() {
      return {
        // range
        range: 0,
        // first
        firstP: {
          x: 0,
          y: 0
        },
        nowP: {
          x: 0,
          y: 0
        },
        openBtnP: {
          x: 0,
          y: 0
        },
        closeBtnP: {
          x: 0,
          y: 0
        },
        isFirst: true,
        //
        line: [],
        dashArray: '0 1069'
      }
    },
    created() {
      for(let j = 0; j <60; j++) {
        this.line.push(j);
      }
      document.getElementById('app').style.background = '#fff';
    },
    watch: {
      range(_range) {
        console.log('range='+_range);
        this.draw1(_range);
      }
    },
    mounted() {
      this.$nextTick(() => {
        let _circle = document.getElementsByTagName('svg');
        if(_circle && _circle[0]) {
          _circle = _circle[0];
          let _width = _circle.clientWidth;
          let _temp = _circle.getBoundingClientRect();
          let _left = _temp.left;
          this.openBtnP = {
            x: _left + _width * -0.6,
            y: _width * 0.06
          };
          if(this.isFirst) {
            this.firstP = {
              x: document.body.clientWidth * 0.5,
              y: _temp.top
            }
            this.isFirst = false;
          }
        }
      })
    },
    computed: {
      clientWidth() {
        return Number((document.body) && (document.body.clientWidth) && (Number(document.body.clientWidth) - 30)) || 320;
      },
    },
    methods: {
      draw1(_value) {
//        let circle = document.getElementById("circle");
//        let range = document.getElementById("range");
        let svg = document.getElementsByTagName('svg');
        let _tempWidth = svg && svg[0] && svg[0].clientWidth;

        let percent = Number(_value /100);
        let perimeter = Math.PI * (_tempWidth - _tempWidth*0.2);
        this.dashArray = perimeter * percent + " " + perimeter * (1- percent);
        console.log(perimeter * percent + " " + perimeter * (1- percent))
//        circle.setAttribute('stroke-dasharray', perimeter * percent + " " + perimeter * (1- percent));
      },
      getAngle(x1, y1, x2, y2) {
        let x = Math.abs(x1 - x2);
        let y = Math.abs(y1 - y2);
        let z = Math.sqrt(x*x + y*y);
        let _angle = 0;
        let _temp = Math.round((Math.asin(y / z) / Math.PI*180));
        console.log('x1='+x1)
        console.log('x2='+x2);
        if(x2 > x1) {
          _angle = 2 * _temp;
        } else {
          _angle = 180 + (180 - 2*_temp);
        }
        console.log('_temp='+_temp)
        return _angle;
      },
      moveCircle(e) {
        e.preventDefault();
        let _temp = e.targetTouches;
        console.log(_temp)
        _temp = _temp[0];
        this.nowP = {
          x: _temp.clientX,
          y: _temp.clientY
        }
        const start = this.firstP;
//        console.log('startx='+start.x);
//        let _angle = this.getAngle(start.x,start.y,_temp.clientX,_temp.clientY);
//        console.log('_angle1='+_angle);
//        let _angle = this.getAngle2();
//        this.range = Number(_angle*100/360);
      },
      getAngle2(px,py,mx,my) {
        //获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        let x = Math.abs(px-mx);
        let y = Math.abs(py-my);
        let z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        let cos = y/z;
        let radina = Math.acos(cos);//用反三角函数求弧度
        let angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

        if(mx > px && my > py) {//鼠标在第四象限
          angle = 180 - angle;
        }

        if(mx === px && my > py) {//鼠标在y轴负方向上
          angle = 180;
        }

        if(mx > px && my === py) {//鼠标在x轴正方向上
          angle = 90;
        }

        if(mx < px && my > py) {//鼠标在第三象限
          angle = 180+angle;
        }

        if(mx < px && my === py) {//鼠标在x轴负方向
          angle = 270;
        }

        if(mx < px && my < py) {//鼠标在第二象限
          angle = 360 - angle;
        }

        return angle;
      }
    },
    components: {
      vSwitch
    }
  }
</script>
