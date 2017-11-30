<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import {ERR_OK} from 'api/config.js';
  import {getSingerDetails} from 'api/singer.js';

  export default {
    created() {
      this._getSingerDetails();
    },
    methods: {
      _getSingerDetails() {
        if(!this.singer.user_id) {
          this.$router.push('/singer');
          return;
        }
        return getSingerDetails(this.singer.user_id).then((res) => {
          if(res.code === ERR_OK) {
            console.log(res);
          }
        });
      }
    },
    computed: {
      ...mapGetters([
        'singer'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .singer-detail
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: $color-background
    z-index: 50
    &.slide-enter-active,.slide-leave-active
      transition: all .3s ease
    &.slide-enter,.slide-leave-to
      transform: translate3d(100%, 0, 0)

</style>
