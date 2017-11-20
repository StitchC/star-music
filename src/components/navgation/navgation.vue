<template>
  <div class="navgation-bar">
    <router-link tag="div" class="nav-item" to="/recommend">
      <span class="item-title">推荐</span>
    </router-link>
    <router-link tag="div" class="nav-item" to="/rank">
      <span class="item-title">排行</span>
    </router-link>
    <router-link tag="div" class="nav-item" to="/search">
      <span class="item-title">搜索</span>
    </router-link>
    <router-link tag="div" class="nav-item" to="/singer">
      <span class="item-title">歌手</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .navgation-bar
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .nav-item
      flex: 1
      text-align: center
      .item-title
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .item-title
          color: $color-theme
          border-bottom: 2px solid $color-theme

</style>
