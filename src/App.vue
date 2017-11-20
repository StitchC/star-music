<template>
  <div id="app">
    <m-header></m-header>
    <m-nav></m-nav>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Header from 'components/header/header.vue';
import Nav from 'components/navgation/navgation.vue';

export default {
  name: 'app',
  components: {
    'm-header': Header,
    'm-nav': Nav
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
