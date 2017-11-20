<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="title">Star Music</h1>
    <!--<router-link tag="div" class="user" to="/user">-->
      <!--<i clas="user-icon"></i>-->
    <!--</router-link>-->
  </div>
</template>

<script type="text/ecmascript-6">
  export default {};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .header
    position: relative
    height: 44px
    line-height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: middle
      width: 30px
      height: 32px
      margin-right: 9px
      bg-image("./logo")
      background-size: 30px 32px
    .title
      display: inline-block
      vertical-align: middle
      line-height: 44px
      font-size: $font-size-large-x
</style>
