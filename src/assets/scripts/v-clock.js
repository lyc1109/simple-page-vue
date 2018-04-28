var clock = (function () {
  var Obj = function (options) {
    this._setPara(options)
    this.init()
  }
  Obj.prototype = {
    constructor: Obj,
    author: 'hwy',
    version: 1.0,
    // 入口方法
    init: function () {
      this._check()
      this._eventListen()
    },
    // 画圆
    _check: function () {
      // 简单校验，查看是否支持HTML5<canvas></canvas>标签
      if (this.canvasByZM.getContext) {
        this._circlePara()
        this._drawCircle(this.$Begin, this.movingBtn) // 传入参数为起始位置（0到1）
      } else {
        alert(
          'Your browser does not support this function temporarily. Please upgrade your browser version as soon as possible.'
        )
      }
    },
    // 设置参数
    _setPara: function (option) {
      this.vue = option.vue
      this.canvasByZM = option.canvasByZM
      this.$acrossColor = option.$acrossColor || '#ddd' // 底色
      this.$fillColor = option.$fillColor || '#ff5151'
      this.moveFlag = false // 开关
      this.$Begin = parseFloat(option.$Begin) || 0.5
      this.$FontSize = option.$FontSize || 50
      // alert(this.ratio)
      this.context = this.canvasByZM.getContext('2d') // 调用getContext方法，返回一个画布环境
      // 屏幕的设备像素比
      var devicePixelRatio = window.devicePixelRatio || 1

      // 浏览器在渲染canvas之前存储画布信息的像素比
      var backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
        this.context.mozBackingStorePixelRatio ||
        this.context.msBackingStorePixelRatio ||
        this.context.oBackingStorePixelRatio ||
        this.context.backingStorePixelRatio || 1

      // canvas的实际渲染倍率
      this.ratio = devicePixelRatio / backingStoreRatio
      // set
      this.canvasByZM.style.width = this.canvasByZM.width
      this.scale = Number(this.canvasByZM.style.width.split('px')[0]) / 300
      this.canvasByZM.style.height = this.canvasByZM.height
      this.canvasByZM.width = Number(this.canvasByZM.style.width.split('px')[0]) * this.ratio
      this.canvasByZM.height = Number(this.canvasByZM.style.height.split('px')[0]) * this.ratio
      this.$circleThinkness = option.$circleThinkness || 40 * this.scale * this.ratio // 底环粗细
      this.ox = option.centerX || 150 * this.scale * this.ratio // 圆环在画布上的x轴坐标
      this.oy = option.centerY || 150 * this.scale * this.ratio // 圆环在画布上的y轴坐标
      this.or = option.circleRadius || 130 * this.scale * this.ratio // 圆环半径70
      this.br = option.startBtnRadius || 20 * this.scale * this.ratio // 圆珠半径
      this.br2 = option.endBtnRadius || 20 * this.scale * this.ratio
      this.startAngel = this._changeAngel(option.startBtnTime) || 1.5 * Math.PI
      this.endAngel = this._changeAngel(option.endBtnTime) || 0.5 * Math.PI // 0.5对6 1对9 1.5对12 2对3
      this.doneInit = false
      
      this.startBtnPos = this._getInitAngel(this.vue.start) // 开始按钮位置
      this.endBtnPos = this._getInitAngel(this.vue.end) // 关闭按钮位置
    
      this.gradStartColor = option.gradStartColor || '#ffc600' // 渐变开始颜色
      this.gradEndColor = option.gradEndColor || '#5ece0f'
      this.startStep = 36
    },
    _getInitAngel: function (t) {
      let angle
      let h = Number(t.split(':')[0])
      let m = Number(t.split(':')[1])
      switch (h) {
        case 0:
        case 12: angle  = Math.PI; break;
        case 1:
        case 13: angle  = 5 / 6 * Math.PI; break;
        case 2:
        case 14: angle  = 4 / 6 * Math.PI; break;
        case 3:
        case 15: angle  = 3 / 6 * Math.PI; break;
        case 4:
        case 16: angle  = 2 / 6 * Math.PI; break;
        case 5:
        case 17: angle  = 1 / 6 * Math.PI; break;
        case 6:
        case 18: angle  =  2 * Math.PI; break;
        case 7:
        case 19: angle  = 11 / 6 * Math.PI; break;
        case 8:
        case 20: angle  = 10 / 6 * Math.PI; break;
        case 9:
        case 21: angle  = 9 / 6 * Math.PI; break;
        case 10:
        case 22: angle  = 8 / 6 * Math.PI; break;
        case 11:
        case 23: angle  = 7 / 6 * Math.PI; break;
        default: break;
      }
      angle -= m / 360 * Math.PI
      let pos = {
        x: Math.round(this.ox + Math.sin(angle) * this.or),
        y: Math.round(this.ox + Math.cos(angle) * this.or)        
      }
      return pos
    },
    _changeAngel: function (t) {
      if (!t) {return}
      let h = Number(t.split(':')[0])
      let m = Number(t.split(':')[1])
      if (h >= 6 && h < 18) {
        let r = (h - 3) / 6 >= 2.5 ? (h - 3) / 6 - 2.5 : (h - 3) / 6
        return (r + m / 360) * Math.PI 
      } else if (h >= 18 && h < 24) {
        let r = (h -12 - 3) / 6 >= 2.5 ? (h -12 - 3) / 6 - 2.5 : (h - 12 - 3) / 6
        return (r + m / 360) * Math.PI 
      } else {
        let r = (h + 12 - 3) / 6        
        return  (r + m / 360) * Math.PI
      }
    },
    // 圆的参数
    _circlePara: function () {
      this.movingBtn = null // true为startBtn
      this.startRound = true // true 为第二圈 false为第一圈
      this.endRound = true
      this.movingDirect = true // true为顺时针 false为逆时针
      this.lastR = null // 旧弧度
      this.lastR2 = null // 旧弧度
    },
    // 根据弧度与距离计算偏移坐标
    _calOffset: function (r, d) {
      // return { x: -Math.sin(r) * d, y: Math.cos(r) * d }
      return {
        x: Math.round(-Math.sin(r) * d),
        y: Math.round(Math.cos(r) * d)
      }
    },
    _calBtnOffset: function (pos) {
      let a = Math.pow(
        Math.pow(Math.abs(pos.x - this.startBtnPos.x), 2) +
        Math.pow(Math.abs(pos.y - this.startBtnPos.y), 2),
        1 / 2
      )
      let b = Math.pow(
        Math.pow(Math.abs(pos.x - this.endBtnPos.x), 2) +
        Math.pow(Math.abs(pos.y - this.endBtnPos.y), 2),
        1 / 2
      )
      // 1.5 是放大可触摸按钮范围
      if (a - b < 0 && a <= this.br * 1.5) {
        return true
      } else if (b - a < 0 && b <= this.br * 1.5) {
        return false
      } else {
        return null
      }
    },
    _getTime: function (currentTime, add, isStart) {
      // 判断第几圈
      let hour = 6
      let h = Number(currentTime.split(':')[0])
      // 开始btn
      if ((Math.abs(this.startAngel / Math.PI - 1.5) < 0.02) && isStart) {
        if (this.movingDirect && h === 23) {
          this.startRound = false
        } else if (this.movingDirect && h === 11) {
          this.startRound = true
        } else if (!this.movingDirect && h === 0) {
          this.startRound = true
        } else if (!this.movingDirect && h === 12) {
          this.startRound = false
        }
      } else if ((Math.abs(this.endAngel / Math.PI - 1.5) < 0.02) && !isStart) {
        if (this.movingDirect && h === 23) {
          this.endRound = false
        } else if (this.movingDirect && h === 11) {
          this.endRound = true
        } else if (!this.movingDirect && h === 0) {
          this.endRound = true
        } else if (!this.movingDirect && h === 12) {
          this.endRound = false
        }
      }

      if (isStart) {
        if (this.startRound && add < 30) {
          add = add + 60
        } else if (!this.startRound) {
          hour = -6
          if (add < 30) {
            add = add + 60
          }
        }
      } else {
        if (this.endRound && add < 30) {
          add += 60
        } else if (!this.endRound) {
          hour = -6
          if (add < 30) {
            add = add + 60
          }
        }
      }
      let addh = Math.floor(Math.round(add * 12) / 60) + hour
      let addm = Math.round(add % 5 * 12)
      addm = addm < 10 ? '0' + addm : addm
      addm === 60 ? addm = '00' : ''
      if (isStart && this.doneInit) {
        this.vue.start = addh + ':' + addm
      } else if (!isStart && this.doneInit) {
        this.vue.end = addh + ':' + addm
      }
      // for test
      let hourDiff = Number(this.vue.end.split(':')[0]) - Number(this.vue.start.split(':')[0])
      let minDiff = Number(this.vue.end.split(':')[1]) - Number(this.vue.start.split(':')[1])
      if (minDiff < 0) {
        minDiff += 60
        hourDiff--
      }
      hourDiff = hourDiff < 0 ? hourDiff + 24 : hourDiff
      this.vue.time = hourDiff + '小时' + minDiff + '分钟'
    },
    _drawCircle: function (n, a) {
      var ctx = this.context
      let t = Number((n.toFixed(3) / (1 / 60)).toFixed(2))
      if (a) {
        this._getTime(this.vue.end, t, false)
        this.startStep++
      } else {
        this._getTime(this.vue.start, t, true)
      }
      ctx.clearRect(0, 0, this.canvasByZM.width, this.canvasByZM.height)
      // clearRect()==>HTML5中的方法，用于擦除指定区域
      // 底环
      ctx.strokeStyle = this.$acrossColor // 底色
      ctx.lineWidth = this.$circleThinkness // 底环粗细
      ctx.beginPath() // 起始一条路径，或重置当前路径
      ctx.arc(this.ox, this.oy, this.or, 0, 2 * Math.PI, true)
      ctx.stroke()
      // 有色环
      // 渐变
      var grad = ctx.createLinearGradient(this.startBtnPos.x, this.startBtnPos.y, this.endBtnPos.x, this.endBtnPos.y)
      /* 指定几个颜色 */
      grad.addColorStop(0, this.gradStartColor)    
      grad.addColorStop(1, this.gradEndColor)
      ctx.strokeStyle = grad // 颜色
      ctx.lineWidth = this.$circleThinkness // 宽度

      ctx.beginPath()
      if (a && this.doneInit) {
        ctx.arc(
          this.ox,
          this.oy,
          this.or,
          this.startAngel,
          (n * 2 + 0.5) * Math.PI,
          false
        )
        this.endAngel = (n * 2 + 0.5) * Math.PI
      } else if (!a && this.doneInit) {
        ctx.arc(
          this.ox,
          this.oy,
          this.or,
          (n * 2 + 0.5) * Math.PI,
          this.endAngel,
          false
        )
        this.startAngel = (n * 2 + 0.5) * Math.PI
      } else if (!this.doneInit) {
        ctx.arc(
          this.ox,
          this.oy,
          this.or,
          this.startAngel,
          this.endAngel,
          false
        )
      }
      // arc(x, y, radius, startAngle, endAngle, anticlockwise)：
      // 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），
      // 从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成
      ctx.stroke()
      ctx.beginPath()
      ctx.font = 15 * this.ratio * this.scale + 'px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgb(45,45,45)'
      ctx.fillText('3', this.ox * 1.65, this.ox)
      ctx.fillText('6', this.ox, this.ox * 1.633333)
      ctx.fillText('9', this.ox / 2.8, this.ox)
      ctx.fillText('12', this.ox, this.ox / 2.7)
      ctx.stroke()
      ctx.closePath()
      // 刻度
      for (var i = 0, angle = 0, tmp, len; i < 12; i++) {
        ctx.beginPath()
        tmp = 109 * this.scale * this.ratio // 因为圆有边框，所以要减去边框宽度
        // 突出显示能被5除尽的刻度
        if (i % 3 === 0) {
          ctx.lineWidth = 2 * this.ratio
          len = 5 * this.ratio
          ctx.strokeStyle = 'rgb(45,45,45)'
        } else {
          ctx.lineWidth = 2 * this.ratio
          len = 5 * this.ratio
          ctx.strokeStyle = 'rgb(135,135,135)'
        }
        ctx.moveTo(this.ox + tmp * Math.cos(angle), this.ox + tmp * Math.sin(angle))
        tmp -= len
        ctx.lineTo(this.ox + tmp * Math.cos(angle), this.ox + tmp * Math.sin(angle))
        ctx.stroke()
        ctx.closePath()
        angle += Math.PI / 6 // 每次递增1/30π
      }
      //
      ctx.font = 20 * this.ratio * this.scale + 'px Arial'
      ctx.fillText(this.vue.time, this.ox, this.oy)

      var d = this._calOffset(n * 2 * Math.PI, this.or)
      if (a) {
        // 圆珠1  关
        ctx.lineWidth = 5
        ctx.strokeStyle = 'blue'
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.font = 20 * this.ratio * this.scale + 'px Arial'
        if (this.doneInit) {
          ctx.arc(this.ox + d.x, this.oy + d.y, this.br, 0, 2 * Math.PI, true)
          this.endBtnPos.x = this.ox + d.x
          this.endBtnPos.y = this.oy + d.y
        } else {
          ctx.arc(this.endBtnPos.x, this.endBtnPos.y, this.br, 0, 2 * Math.PI, true)          
        }
        this.movingBtn = false
        ctx.fill()
        ctx.closePath()
        //   font
        ctx.beginPath()
        ctx.fillStyle = 'rgb(255,198,0)'
        ctx.fillText('关', this.endBtnPos.x, this.endBtnPos.y)
        // 静止
        ctx.fillStyle = '#fff'
        ctx.lineWidth = 2
        ctx.strokeStyle = '#000'
        ctx.beginPath()
        ctx.arc(
          this.startBtnPos.x,
          this.startBtnPos.y,
          this.br2,
          0,
          2 * Math.PI,
          true
        )
        ctx.fill()
        ctx.closePath()
        // 字
        ctx.fillStyle = 'green'
        ctx.beginPath()
        ctx.fillText('开', this.startBtnPos.x, this.startBtnPos.y)
      } else {
        // 1
        ctx.font = 20 * this.ratio * this.scale + 'px Arial'
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(
          this.endBtnPos.x,
          this.endBtnPos.y,
          this.br,
          0,
          2 * Math.PI,
          true
        )
        ctx.fill()
        //   font
        ctx.fillStyle = 'rgb(255,198,0)'
        ctx.beginPath()
        ctx.fillText('关', this.endBtnPos.x, this.endBtnPos.y)
        // 圆珠2
        ctx.fillStyle = '#fff'
        ctx.closePath()
        ctx.beginPath()
        if (this.doneInit) {
          ctx.arc(this.ox + d.x, this.oy + d.y, this.br2, 0, 2 * Math.PI, true)
          this.startBtnPos.x = this.ox + d.x
          this.startBtnPos.y = this.oy + d.y
        } else {
          ctx.arc(this.startBtnPos.x, this.startBtnPos.y, this.br2, 0, 2 * Math.PI, true)          
        }
        if (a !== null) {
          this.movingBtn = true
        }
        ctx.fill()
        // font
        ctx.fillStyle = 'green'
        ctx.fillText('开', this.startBtnPos.x, this.startBtnPos.y)
      }
      this.doneInit = true
    },
    // 获取鼠标当前坐标
    _getXY: function (e) {
      var that = this
      var et = e.touches ? e.touches[0] : e
      var x = et.clientX
      var y = et.clientY
      return {
        x:
          (x - that.canvasByZM.getBoundingClientRect().left) * this.ratio * this.scale,
        y:
          (y - that.canvasByZM.getBoundingClientRect().top + 2) * this.ratio * this.scale
        // 这里可以使用getBoundingClientRect获取对应元素到视窗的距离
      }
    },
    _calR: function (oldr, newr) {
      if ((newr > 0 && newr > oldr) || (newr < 0 && newr > oldr)) {
        this.movingDirect = true
      } else if ((newr < 0 && newr < oldr) || (newr > 0 && newr < oldr)) {
        this.movingDirect = false
      }
    },
    // 监听事件
    _eventListen: function () {
      // 是否支持触屏
      var on = 'ontouchstart' in document
        ? {
          start: 'touchstart',
          move: 'touchmove',
          end: 'touchend'
        } : {
          start: 'mousedown',
          move: 'mousemove',
          end: 'mouseup'
        }
      var that = this
      this.canvasByZM.addEventListener(
        on.end,
        function (e) {
          that.moveFlag = false
          e.preventDefault()
        },
        false
      )
      this.canvasByZM.addEventListener(
        on.start,
        function (e) {
          // 判断点击哪个
          that.movingBtn = that._calBtnOffset(that._getXY(e))
          that.moveFlag = true
          e.preventDefault()
        },
        false
      )
      this.canvasByZM.addEventListener(
        on.move,
        function (e) {
          e.preventDefault()
          if (that.moveFlag && that.movingBtn) {
            // 获取坐标
            let k = that._getXY(e)
            // 计算弧度
            let r = Math.atan2(k.x - that.ox, that.oy - k.y)
            if (that.lastR !== null) {
              that._calR(that.lastR, r)
            }
            that.lastR = r
            // 画圆
            that._drawCircle((Math.PI + r) / (2 * Math.PI), false)
          } else if (that.moveFlag && that.movingBtn === false) {
            // 获取坐标
            let k = that._getXY(e)
            // 计算弧度
            let r = Math.atan2(k.x - that.ox, that.oy - k.y)
            if (that.lastR2 !== null) {
              that._calR(that.lastR2, r)
            }
            that.lastR2 = r
            that._drawCircle((Math.PI + r) / (2 * Math.PI), true)
          }
        },
        false
      )
    },
    remove: function () {
      // 释放内存
      for(var i in this){
        if (this.hasOwnProperty(i)) {
          this[i] = null
        }
      }
    }
  }
  return Obj
})()
export default clock
