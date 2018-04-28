/**
 * 环形进度条
 *
 * @author luoyc
 * @date 2017/8/31
 */
export default {
  draw(id,percent,sR,isText,isReload) {
    if (percent < 0 || percent > 100) {
      return
    }
    if (sR < Math.PI/2 || sR >= 3/2 * Math.PI) {
      return
    }
    let canvas = document.querySelector(id);
    // 避免内存泄漏
    if(!canvas) {
      return false;
    }
    let that = this;
    let cxt = canvas.getContext('2d');
    let _multiple = 2;
    let cWidth = canvas.width;
    let cHeight = canvas.height;
    let arcXPos = cWidth/_multiple;
    let arcYPos = cHeight/_multiple;
    let arcLineW = 15*_multiple;
    let baseColor = 'rgba(255,255,255,.3)';
    let coverColor = '#ffffff';
    let pointColor = '#5ece0f';
    let warnColor = '#ffc600';
    let PI = Math.PI
    sR = sR || 2/3 * PI // 默认圆弧的起始点弧度为π的2/3
    let finalRadian = sR + ((PI + (PI - sR) * 2) * percent / 100);// 白圈的终点弧度
    let step = (PI + (PI - sR) * 2)/100; // 一个1%对应的弧度大小
    let text = 0; // 显示的数字
    let _endRadian = sR + (PI + (PI - sR) * 2);

    let drawOther = function() {
      if(!isText) {
        // 坐标首尾
        let _angle = 2*Math.PI - (sR + 100 * step);
        let _xPos = Math.cos(_angle) * 45 + cWidth/1.7 // 刻度的x坐标
        that.drawCanvas(id,arcXPos/1.5,cHeight*0.8 + 3,'',arcXPos/1.8,cHeight*0.9 + 4, coverColor,2,0,0,'butt');
        that.drawCanvas(id,_xPos + 2,cHeight*0.8 + 1,'',_xPos + 20,cHeight*0.9 + 3, coverColor,2,0,0,'butt');

        // 画周边弧线
        let _fromX = arcXPos + 5;
        let _fromY = arcYPos + 5;
        let _fromX2 = arcXPos - 5;
        let _fromY2 = arcYPos - 5;
        let _toX = 60*_multiple + arcLineW;
        let _toY = PI;
        // that.drawCanvas(id, _fromX, _fromY, _toX, _toY, PI*1.5, baseColor, 2,1.6,3.6,'butt');
        // that.drawCanvas(id, _fromX2, _fromY2, _toX, _toY/45, PI/3.2, baseColor, 2,1.6,3.6,'butt');

        // 画箭头
        // that.drawCanvas(id, arcXPos - 13, 2,'', arcXPos, 4, baseColor, 2,0,0,'butt',baseColor);
        // that.drawCanvas(id, _xPos*1.1 + 5, cHeight*0.9,'', _xPos*1.1 + 20, cHeight*0.9 - 3, baseColor, 2,0,0,'butt',baseColor);
      }
    }

    if(isReload) {
      cxt.clearRect(0, 0, cWidth, cHeight);
      // 画灰色圆弧
      this.drawCanvas(id, arcXPos, arcYPos, 60*_multiple, sR, _endRadian, baseColor, arcLineW,1.6,3.6,'butt');
      let endRadian =  sR + text * 100;
      // 刻度图标
      let angle = 2*Math.PI - endRadian // 转换成逆时针方向的弧度（三角函数中的）
      let xPos = Math.cos(angle) * 45 + cWidth/1.75 // 圆心的x坐标
      let yPos = -Math.sin(angle) * 40 + cHeight/2.55 // 圆心的y坐标
      this.drawCanvas(id,xPos, yPos, 70, 0, 2*PI, 'transparent', 1,2,2,'butt','rgba(0,0,0,.3)');

      cxt.fillStyle = warnColor;
      cxt.font = `${50*_multiple}px PT Sans`;
      let textWidth = cxt.measureText(text).width;
      cxt.fillText('!', xPos - textWidth/3.5, arcYPos + 20*_multiple);

      drawOther();
    } else {
      let timer = setInterval(() => {
        cxt.clearRect(0, 0, cWidth, cHeight);
        let endRadian =  sR + text * step;

        // 刻度图标
        let angle = 2*Math.PI - endRadian // 转换成逆时针方向的弧度（三角函数中的）
        // console.log(angle)
        let xPos = Math.cos(angle) * (45 * _multiple) + cWidth/2 // 圆心的x坐标
        let yPos = -Math.sin(angle) * (45 * _multiple) + cHeight/2 // 圆心的y坐标
        this.drawCanvas(id,xPos, yPos, 8, 0, 2*PI, pointColor, 1,2,2,'butt',pointColor);

        // 画灰色圆弧
        this.drawCanvas(id, arcXPos, arcYPos, 60*_multiple, sR, _endRadian, baseColor, arcLineW,1.6,3.6,'butt');

        drawOther();

        // 画彩色圆弧
        this.drawCanvas(id, arcXPos, arcYPos, 60*_multiple, sR, endRadian, '', arcLineW,1.6,3.6,'butt');

        // 文字
        cxt.fillStyle = coverColor;
        cxt.font = `${36*_multiple}px PT Sans`;
        let textWidth = cxt.measureText(text).width;
        cxt.fillText(text, arcXPos - textWidth/2 - 5*_multiple, arcYPos + 12*_multiple);
        cxt.font = `${11*_multiple}px PT Sans`;
        cxt.fontWeight = 'lighter';
        cxt.fillText('%',arcXPos - textWidth/2 + 60*_multiple, arcYPos + 12*_multiple);
        cxt.font = `${11*_multiple}px PT Sans`;
        cxt.fontWeight = 'lighter';

        text++;
        // if(isText) {
          cxt.fillText('0',arcXPos/2,cHeight);
          cxt.fillText('100',cWidth/1.5,cHeight);
        // }
        if (endRadian.toFixed(2) >= finalRadian.toFixed(2)) {
          clearInterval(timer);
        }
      }, 16);
    }
  },
  drawCanvas(id,fromX,fromY,r,toX,toY,color,lineWidth,lineStart,lineEnd,lineCap,pointColor) {
    let canvas = document.querySelector(id);
    if(!canvas) {
      return false;
    }
    let ctx = canvas.getContext('2d');

    ctx.beginPath();
    let _pointColor = 'transparent';
    if(pointColor) {
      _pointColor = pointColor;
    }

    if(lineCap) {
      ctx.lineCap = lineCap;
    }
    if(lineStart !== 0 || lineEnd !== 0) {
      ctx.setLineDash([lineStart,lineEnd]);
    } else {
      ctx.setLineDash([lineStart, 0]);
    }

    // color为空则默认渐变色，否则背景色为color
    if(color) {
      ctx.strokeStyle = color;
    } else {
      let gr = ctx.createRadialGradient(fromX,fromY,r*1.6,fromX*-1,fromY*2,r*2);
      //添加颜色端点
      gr.addColorStop(0,'rgba(0,255,0,1)');
      gr.addColorStop(0.7,'rgba(255,198,0,.8)');
      gr.addColorStop(1,'rgba(255,198,0,1)');

      //应用fillStyle生成渐变
      ctx.strokeStyle = gr;
    }

    if(_pointColor) {
      ctx.fillStyle = _pointColor;
    }

    ctx.lineWidth = lineWidth || 0;

    if(!lineStart && !lineEnd) {
      //绘制一条带颜色的直线
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      if(pointColor) {
        ctx.lineTo(fromX + 5, toY + 1);
        ctx.fill();
      }
    } else if(r) {
      ctx.arc(fromX, fromY, r, toX, toY, false);
      ctx.fill();
    }

    ctx.stroke();
    // ctx.closePath();
  },
}
