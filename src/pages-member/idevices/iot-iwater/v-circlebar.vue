<style lang="scss" scoped>
  #v-circle{
    display: flex;
    justify-content: center;
    margin: 0 auto;
    position: relative;
  }
</style>
<template>
  <div id="v-circle">
    <canvas width="300" height="300" :style="{transform: 'scale(' + scaleX + ',' + '1)'}" ></canvas>
  </div>
</template>
<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 100
    },
    baseColor: {
      type: String,
      default: 'rgba(255,255,255,.3)'
    },
    fontColor: {
      type: String,
      default: '#fff'
    },
    linearBeginColor: {
      type: String,
      default: 'rgba(255,198,0,1)'
    },
    linearEndColor: {
      type: String,
      default: 'rgba(0,255,0,1)'
    }
  },
  data () {
    return {
      oldPercent: 0,
      scaleX: 0,
      scaleY: 0,
      run: false
    }
  },
  computed: {
    canvasPercent: function(){
      if (!this.run) {
        return this.percent
      }
    }
  },
  watch: {
    canvasPercent: function () {
      this.draw('canvas', this.canvasPercent, 2, false, this.oldPercent)
    }
  },
  mounted () {
    this.draw('canvas', this.canvasPercent, 2, false, this.oldPercent)
    this.scaleX = Number(document.getElementById('v-circle').style.width.split('p')[0]) / 300
    this.scaleY = Number(document.getElementById('v-circle').style.height.split('p')[0]) / 300
  },
  methods: {
    draw (id, percent, sR, isText, oldPercent = 0) {
      if (this.run) {
        return 
      }
      this.run = true
      if (percent < 0 || percent > 100) {
        return
      }
      if (sR < Math.PI / 2 || sR >= 3 / 2 * Math.PI) {
        return
      }
      let canvas = document.querySelector(id)
      // 避免内存泄漏
      if (!canvas) {
        return false
      }
      // 替换旧百分比
      let that = this
      this.oldPercent = percent
      let cxt = canvas.getContext('2d')
      let _multiple = 2
      let cWidth = canvas.width
      let cHeight = canvas.height
      let arcXPos = cWidth / _multiple
      let arcYPos = cHeight / _multiple
      let arcLineW = 15 * _multiple
      let baseColor = that.baseColor
      let coverColor = that.fontColor
      let PI = Math.PI
      sR = sR || 2 / 3 * PI // 默认圆弧的起始点弧度为π的2/3
      let step = (PI + (PI - sR) * 2) / 100 // 一个1%对应的弧度大小
      var finalRadian = sR + (PI + (PI - sR) * 2) * percent / 100 // 白圈的终点弧度
      let text
      if (oldPercent !== 0) {
        if (oldPercent > percent) {
          text = percent // 显示的数字
        } else {
          text = oldPercent
        }
      } else {
        text = 0
      }
      let _endRadian = sR + (PI + (PI - sR) * 2)
      let drawOther = function () {
        if (!isText) {
          // 坐标首尾
          let _angle = 2 * Math.PI - (sR + 100 * step)
          let _xPos = Math.cos(_angle) * 45 + cWidth / 1.7 // 刻度的x坐标
          that.drawCanvas(id, arcXPos / 1.37, cHeight * 0.8 + 6, '', arcXPos / 1.52, cHeight * 0.9 + 6, coverColor, 2, 0, 0, 'butt')
          that.drawCanvas(id, _xPos - 2, cHeight * 0.8 + 5, '', _xPos + 10, cHeight * 0.9 + 5, coverColor, 2, 0, 0, 'butt')
        }
      }
      // 每次重绘
      let timer = setInterval(() => {
        cxt.clearRect(0, 0, cWidth, cHeight)
        let endRadian = sR + text * step
        if (percent > oldPercent) {
          endRadian = sR + text * step
        } else {
          endRadian = sR + oldPercent * step
        }
        // 刻度图标
        let angle = 2 * Math.PI - endRadian // 转换成逆时针方向的弧度（三角函数中的）
        let xPos = Math.cos(angle) * (45 * _multiple) + cWidth / 2 // 圆心的x坐标
        let yPos = -Math.sin(angle) * (45 * _multiple) + cHeight / 2 // 圆心的y坐标
        // 水滴指针旋转角度
        that.rotateAngle = -58.43 * angle + 39.43
        // 旧的绿色圆形指针
        that.drawCanvas(id, xPos, yPos, 8, 0, 2 * PI, '#5ece0f', 1, 2, 2, 'butt', '#5ece0f')
        // 画灰色圆弧
        that.drawCanvas(id, arcXPos, arcYPos, 60 * _multiple, sR, _endRadian, baseColor, arcLineW, 1.6, 3.6, 'butt')
        drawOther()
        // 画彩色圆弧
        that.drawCanvas(id, arcXPos, arcYPos, 60 * _multiple, sR, endRadian, '', arcLineW, 1.6, 3.6, 'butt')
        // 文字
        cxt.fillStyle = coverColor
        cxt.font = `${36 * _multiple}px PT Sans`
        let textWidth
        if (oldPercent < percent) {
          textWidth = cxt.measureText(text).width
          cxt.fillText(
            text,
            arcXPos - textWidth / 2 - 5 * _multiple,
            arcYPos + 12 * _multiple
          )
          text++
          if (endRadian.toFixed(2) >= finalRadian.toFixed(2)) {
            clearInterval(timer)
            that.run = false
          }
        } else if (oldPercent >= percent) {
          textWidth = cxt.measureText(oldPercent).width
          cxt.fillText(
            oldPercent,
            arcXPos - textWidth / 2 - 5 * _multiple,
            arcYPos + 12 * _multiple
          )
          oldPercent--
          if (endRadian.toFixed(2) <= finalRadian.toFixed(2)) {
            clearInterval(timer)
            that.run = false
          }
        }
        cxt.font = `${11 * _multiple}px PT Sans`
        cxt.fontWeight = 'lighter'
        if (percent !== 100) {
          cxt.fillText(
            '%',
            arcXPos - textWidth / 2 + 40 * _multiple,
            arcYPos + 12 * _multiple
          )
        } else {
          cxt.fillText(
            '%',
            arcXPos - textWidth / 2 + 60 * _multiple,
            arcYPos + 12 * _multiple
          )
        }
        cxt.font = `${11 * _multiple}px PT Sans`
        cxt.fontWeight = 'lighter'

        cxt.fillText('0', arcXPos / 2, cHeight)
        cxt.fillText('100', cWidth / 1.5, cHeight)

      }, 16)
    },
    drawCanvas (id, fromX, fromY, r, toX, toY, color, lineWidth, lineStart, lineEnd, lineCap, pointColor) {
      let that = this
      let canvas = document.querySelector(id)
      if (!canvas) {
        return false
      }
      let ctx = canvas.getContext('2d')
      ctx.beginPath()
      let _pointColor = 'transparent'
      if (pointColor) {
        _pointColor = pointColor
      }
      if (lineCap) {
        ctx.lineCap = lineCap
      }
      if (lineStart !== 0 || lineEnd !== 0) {
        ctx.setLineDash([lineStart, lineEnd])
      } else {
        ctx.setLineDash([lineStart, 0])
      }
      // color为空则默认渐变色，否则背景色为color
      if (color) {
        ctx.strokeStyle = color
      } else {
        let gr = ctx.createRadialGradient(
          fromX,
          fromY,
          r * 1.6,
          fromX * -1,
          fromY * 2,
          r * 2
        )
        // 添加颜色端点
        gr.addColorStop(0.5, that.linearEndColor)
        gr.addColorStop(0.9, that.linearBeginColor)
        // 应用fillStyle生成渐变
        ctx.strokeStyle = gr
      }
      if (_pointColor) {
        ctx.fillStyle = _pointColor
      }
      ctx.lineWidth = lineWidth || 0
      if (!lineStart && !lineEnd) {
        // 绘制一条带颜色的直线
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        if (pointColor) {
          ctx.lineTo(fromX + 5, toY + 1)
          ctx.fill()
        }
      } else if (r) {
        ctx.arc(fromX, fromY, r, toX, toY, false)
        ctx.fill()
      }
      ctx.stroke()
    }
  }
}
</script>
