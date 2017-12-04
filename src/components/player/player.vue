<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="main"
                 @enter="enter",
                 @after-enter="afterEnter",
                 @leave="leave",
                 @after-leave="afterLeave"
    >
      <div class="main-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h2 class="title" v-html="currentSong.name"></h2>
          <h2 class="sub-title" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-inner">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="playingRotate">
                <img class="cd-cover" :src="currentSong.image">
              </div>
            </div>
            <div class="player-lyric-wrapper">
              <div class="player-lyric"></div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="operate">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlay" :class="playingStateIcon"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="toFullScreen">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="playingRotate">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlay" :class="miniPlayingStateIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 播放器组件
   *
   * */
  import {mapGetters, mapMutations} from 'vuex';
  import animations from 'create-keyframe-animation';
  import {prefixStyle} from 'common/js/dom.js';

  const transform = prefixStyle('transform');

  export default {
    data() {
      return {
        songReady: false
      };
    },
    methods: {
      back() {
        this.setFullScreen(false);
      },
      toFullScreen() {
        this.setFullScreen(true);
      },
      togglePlay() {
        this.setPlayingStatus(!this.playing);
      },
      prevSong() {
        if(!this.songReady) {
          return;
        }
        let index = this.currentIndex - 1;
        if(index === -1) {
          index = this.playList.length - 1;
        }
        this.setCurIndex(index);
        // 如果此时是暂停播放状态 将他转变为播放状态
        if(!this.playing) {
          this.togglePlay();
        }
        this.songReady = false;
      },
      nextSong() {
        if(!this.songReady) {
          return;
        }
        let index = this.currentIndex + 1;
        if(index === this.playList.length) {
          index = 0;
        }
        this.setCurIndex(index);
        // 如果此时是暂停播放状态 将他转变为播放状态
        if(!this.playing) {
          this.togglePlay();
        }
        this.songReady = false;
      },
      ready() {
        this.songReady = true;
      },
      error() {},
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale();

        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0，0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0，0, 0) scale(1)`
          }
        };

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });

        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      afterEnter() {
         animations.unregisterAnimation('move');
         this.$refs.cdWrapper.style.animation = '';
      },
      leave(el, done) {
        const {x, y, scale} = this._getPosAndScale();

        this.$refs.cdWrapper.style.transition = 'all .4s';
        this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transform = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      _getPosAndScale() {
        // 获取迷你播放器cd 图片的位置及尺寸
        const miniCdWidth = 40;
        const miniCdLeft = 40;
        // const miniCdBottom = 30;

        // 获取主播放器cd 图片的位置及尺寸
        const mainCdTop = 80;
        const mainCdWidth = window.innerWidth * 0.8;

        // 计算缩放比例
        const scale = miniCdWidth / mainCdWidth;
        const x = -(window.innerWidth / 2 - miniCdLeft);
        const y = window.innerHeight - mainCdTop - mainCdWidth / 2 - mainCdTop;

        return {
          x,
          y,
          scale
        };
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingStatus: 'SET_PLAYING_STATE',
        setCurIndex: 'SET_CURRENT_INDEX'
      })
    },
    watch: {
      currentSong(val) {
        this.$nextTick(() => {
          this.$refs.audio.play();
        });
      },
      playing(newPlayState) {
        const audio = this.$refs.audio;

        this.$nextTick(() => {
          newPlayState ? audio.play() : audio.pause();
        });
      }
    },
    computed: {
      playingStateIcon() {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniPlayingStateIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      playingRotate() {
        return this.playing ? 'play' : 'play stop';
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'currentIndex',
        'playing'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .player
    .main-player
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      z-index: 150
      background-color: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .sub-title
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-inner
          position: relative
          display: inline-block
          vertical-align: top
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 25s linear infinite
              &.stop
                animation-play-state: paused
              .cd-cover
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .operate
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
            &.i-left
              text-align: right
            &.i-center
              padding: 0 20px
              text-align: center
              i
                font-size: 40px
            &.i-right
              text-align: left
      &.main-enter-active, .main-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.main-enter, .main-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      position: fixed
      display: flex
      align-items: center
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, .mini-leave-active
        transition: all .4s
      &.mini-enter, .mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 20s linear infinite
          &.stop
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(360deg)
</style>
