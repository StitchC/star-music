<template>
  <div class="progress-circle">
    <svg :width="circleArea" :height="circleArea" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dasharray" :stroke-dashoffset="calculProgress"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 迷你播放器进度条组件
   *
   * @param {Integer} circleArea - 设置圆形进度条包裹层的宽高
   * @param {Float} percent - 控制圆形进度条的长度
   * */

  const ROUND_RADIUS = 50; // 圆环半径
  export default {
    props: {
      circleArea: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number
      }
    },
    computed: {
      dasharray() {
        return Math.PI * ROUND_RADIUS * 2;
      },
      calculProgress() {
        return (1 - this.percent) * this.dasharray;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
