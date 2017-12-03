<template>
    <div class="music-list">
      <div class="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-img" :style="backgroundImg" ref="singerBg">
        <div class="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <scroll :data="songs" class="list" ref="list" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="onScroll">
        <div class="song-list-wrap">
          <song-list :songList="songs"></song-list>
        </div>
      </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
    /**
     *  歌曲列表组件
     *
     *  @param {String} bgImg - 组件头部背景图
     *  @param {Array} songs - 组件的音乐数据
     *  @param {String} title - 组件的标题
     * */
    import Scroll from 'base/scroll/scroll.vue';
    import SongList from 'base/song-list/song-list.vue';

    const RESERVE_HEIGHT = 40; // 顶部歌手名栏的嘎度

    export default {
        data() {
          return {
            posY: 0
          };
        },
        props: {
          bgImg: {
            type: String,
            default: ''
          },
          songs: {
            type: Array,
            default: () => {
              return [];
            }
          },
          title: {
            type: String,
            default: ''
          }
        },
        mounted() {
          this.bgImgHeight = this.$refs.singerBg.offsetHeight;
          this.miniTranslateY = -this.bgImgHeight + RESERVE_HEIGHT;
          this.$refs.list.$el.style.top = `${this.$refs.singerBg.offsetHeight}px`;
        },
        created() {
          this.probeType = 3;
          this.listenScroll = true;
        },
        components: {
          scroll: Scroll,
          'song-list': SongList
        },
        computed: {
            backgroundImg() {
              return `background-image: url(${this.bgImg})`;
            }
        },
        methods: {
          onScroll(pos) {
           this.posY = pos.y;
            // console.log(this.posY);
          }
        },
        watch: {
          posY(val) {
            let translateY = Math.max(this.miniTranslateY, val);
            let zIndex = 0;
            if(val < this.miniTranslateY) {
              zIndex = 10;
              this.$refs.singerBg.style.height = `${RESERVE_HEIGHT}px`;
              this.$refs.singerBg.style.paddingTop = 0;
            }else {
              this.$refs.singerBg.style.height = 0;
              this.$refs.singerBg.style.paddingTop = '70%';
            }
            this.$refs.singerBg.style.zIndex = zIndex;
            this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`;
            this.$refs.layer.style['-webkit-transform'] = `translate3d(0,${translateY}px,0)`;
          }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-img
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      width: 100%
      top: 0
      bottom: 0
      background: $color-background
      .song-list-wrap
        padding: 20px 30px
</style>
