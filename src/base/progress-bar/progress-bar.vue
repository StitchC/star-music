<template>
  <div class="progress-bar" ref="progressBarWrap" @click="progressBarClick">
    <div class="bar-back">
      <div class="bar-front" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart="progessBtnTouchStart"
           @touchmove="progessBtnTouchMove"
           @touchend="progessBtnTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 进度条组件
   *
   * @param {float} percent - 当前播放歌曲的进度百分比
   * */

  import {prefixStyle} from 'common/js/dom.js';
  const transform = prefixStyle('transform');
  const BTN_WRAP_LEFT_DIFF = 8; // 进度条按钮往左缩进的距离

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      // 创建一个触摸对象 共享触摸事件中的数据
      this.touch = {};
    },
    methods: {
      progessBtnTouchStart(event) {
        this.touch.touchStarted = true;
        this.touch.startX = event.touches[0].pageX;
        this.touch.curProgress = this.$refs.progress.offsetWidth; // 获取当前进度条的宽度
      },
      progessBtnTouchMove(event) {
        if(!this.touch.touchStarted) {
          return;
        }

        let distance = event.touches[0].pageX - this.touch.startX; // 获取拖动的距离
        let addWidth = Math.min(this.$refs.progressBarWrap.offsetWidth - BTN_WRAP_LEFT_DIFF, Math.max(0, distance + this.touch.curProgress));
         this._setProgressControlPos(addWidth);
      },
      progessBtnTouchEnd() {
        this.touch.touchStarted = false;
        this._triggerPercent();
      },
      progressBarClick(event) {
        // 通过event.offsetX 获取的位置不当 修正
        // this._setProgressControlPos(event.offsetX);
        let rect = this.$refs.progressBarWrap.getBoundingClientRect();
        let offsetX = event.pageX - rect.left;
        this._setProgressControlPos(offsetX);
        this._triggerPercent();
      },
      _triggerPercent() {
        // 当进度条手动发生改变的时候 向父组件派发事件
        let barWidth = this.$refs.progressBarWrap.offsetWidth - BTN_WRAP_LEFT_DIFF;
        let newPercent = this.$refs.progress.offsetWidth / barWidth;
        this.$emit('percent-change', newPercent);
      },
      _setProgressControlPos(offsetWidth) {
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.progress.style.width = `${offsetWidth}px`;
      }
    },
    watch: {
      percent(newVal) {
        if(newVal >= 0 && !this.touch.touchStarted) {
          // 进度条的总长度
          const barWidth = this.$refs.progressBarWrap.offsetWidth - BTN_WRAP_LEFT_DIFF;
          let curWidth = barWidth * newVal;
          this._setProgressControlPos(curWidth);
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .progress-bar
    height: 30px
    line-height: 30px
    .bar-back
      display: inline-block
      position: relative
      vertical-align: middle
      width: 100%
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .bar-front
        position: absolute
        top: 0
        left: 0
        bottom: 0
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -15px
        width: 30px
        height: 30px
        line-height: 30px
        .progress-btn
          display: inline-block
          box-sizing: border-box
          vertical-align: middle
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
