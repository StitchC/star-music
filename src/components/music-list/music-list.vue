<template>
    <div class="music-list">
      <div class="back">
        <i class="icon-back" @click="back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-img" :style="backgroundImg" ref="singerBg">
        <div class="play-wrapper">
          <div class="play-btn" v-show="songs.length > 0" @click="randomPlay" ref="playBtn">
            <i class="icon-play"></i>
            <p class="txt">随机播放</p>
          </div>
        </div>
        <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <scroll :data="songs" class="list" ref="list" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="onScroll">
        <div class="song-list-wrap">
          <song-list :songList="songs" @select="selectSong"></song-list>
        </div>
        <div class="loading-wrap" v-show="!songs.length">
          <loading></loading>
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
    import Loading from 'base/loading/loading.vue';
    import {prefixStyle} from 'common/js/dom.js';
    import {mapActions} from 'vuex';

    const RESERVE_HEIGHT = 40; // 顶部歌手名栏的高度
    const transform = prefixStyle('transform');
    const backdrop = prefixStyle('backdrop-filter');

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
          'song-list': SongList,
          'loading': Loading
        },
        computed: {
            backgroundImg() {
              return `background-image: url(${this.bgImg})`;
            }
        },
        methods: {
          onScroll(pos) {
           this.posY = pos.y;
          },
          back() {
            this.$router.push('/singer');
          },
          selectSong(item, index) {
            this.selectPlay({
              list: this.songs,
              index: index
            });
          },
          randomPlay() {},
          ...mapActions([
            'selectPlay'
          ])
        },
        watch: {
          posY(val) {
            let translateY = Math.max(this.miniTranslateY, val);
            let zIndex = 0;
            let percent = Math.abs(val / this.bgImgHeight);
            let scale = 1 + percent;
            let blur = Math.min(20 * percent, 20);

            this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;

            if(val > 0) {
              // 如果val 大于0 表示当前已经滚动到顶部并且还在向下拉
              // 那么 放大图片的比例
              this.$refs.singerBg.style[transform] = `scale(${scale})`;
              zIndex = 10;
            }else {
              // 如果列表向上滚动
              // 则按比例模糊
              this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
            }

            if(val < this.miniTranslateY) {
              zIndex = 10;
              this.$refs.singerBg.style.height = `${RESERVE_HEIGHT}px`;
              this.$refs.singerBg.style.paddingTop = 0;
              this.$refs.playBtn.style.display = 'none';
            }else {
              this.$refs.singerBg.style.height = 0;
              this.$refs.singerBg.style.paddingTop = '70%';
              this.$refs.playBtn.style.display = '';
            }

            this.$refs.singerBg.style.zIndex = zIndex;
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
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play-btn
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .txt
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        bottom: 0
        width: 100%
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      width: 100%
      bottom: 0
      background: $color-background
      .song-list-wrap
        padding: 20px 30px
</style>
