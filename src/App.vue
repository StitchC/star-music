<template>
  <div id="app">
    <m-header></m-header>
    <m-nav></m-nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import Header from 'components/header/header.vue';
import Nav from 'components/navgation/navgation.vue';
import Player from 'components/player/player.vue';

export default {
  name: 'app',
  components: {
    'm-header': Header,
    'm-nav': Nav,
    player: Player
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
