<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-img="bgImg"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import {ERR_OK} from 'api/config.js';
  import {getSingerDetails} from 'api/singer.js';
  import {createSong} from 'common/js/song';
  import musicList from 'components/music-list/music-list.vue';

  export default {
    data() {
      return {
        songs: []
      };
    },
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
            this.songs = this._normalizeSongs(res.data.list);
            console.log(this.songs);
          }
        });
      },
      _normalizeSongs(list) {
        let result = [];
        list.forEach((item) => {
          let {musicData} = item;
          if (musicData.songid && musicData.albumid) {
            result.push(createSong(musicData));
          }
        });
        return result;
      }
    },
    components: {
      'music-list': musicList
    },
    computed: {
      title() {
        return this.singer.name;
      },
      bgImg() {
        return this.singer.avatar;
      },
      ...mapGetters([
        'singer'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .slide-enter-active,.slide-leave-active
    transition: all .3s ease
  .slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
