<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24">
    <p class="desc"></p>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 加载组件
   *
   * @param {String} desc - 加载组件的提示文字
   * */

  export default {
    pros: {
      desc: {
        type: String,
        default: '加载中...'
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .loading
    width: 100%
    text-align: center
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>
