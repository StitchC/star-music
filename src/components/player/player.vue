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
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-inner">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="playingRotate">
                <img class="cd-cover" :src="currentSong.image">
              </div>
            </div>
            <div class="player-lyric-wrapper">
              <div class="player-lyric">{{currentLyricSentence}}</div>
            </div>
          </div>
          <scroll class="full-screen-lyric-wrapper" ref="lyricScroll" :data="currentLyric && currentLyric.lines">
            <div class="full-screen-lyric">
              <div v-if="currentLyric !== null">
                <p ref="lyricLine"
                   class="lyric-text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 0}"></span>
            <span class="dot" :class="{'active':currentShow === 1}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime | formatTime}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="playPercent" @percent-change="progressChange"></progress-bar>
            </div>
            <span class="time time-r">-{{residueTime | formatTime}}</span>
          </div>
          <div class="operate">
            <div class="icon i-left" @click="changeMode">
              <i :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disabled">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" :class="disabled">
              <i @click="togglePlay" :class="playingStateIcon"></i>
            </div>
            <div class="icon i-right" :class="disabled">
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
          <p class="desc" v-text="currentLyricSentence"></p>
        </div>
        <div class="control">
          <progress-circle :circle-area="circleArea" :percent="playPercent">
            <i @click.stop="togglePlay" class="mini-progress-bar" :class="miniPlayingStateIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 播放器组件
   *
   * */
  import ProgressBar from 'base/progress-bar/progress-bar.vue';
  import ProgressCircle from 'base/progress-circle/progress-circle.vue';
  import {mapGetters, mapMutations} from 'vuex';
  import animations from 'create-keyframe-animation';
  import {prefixStyle} from 'common/js/dom.js';
  import {playerMode} from 'common/js/config.js';
  import {shuffle} from 'common/js/util.js';
  import LyricParse from 'lyric-parser';
  import Scroll from 'base/scroll/scroll';

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');
  const SHOW_CD = 0;
  const SHOW_LYRIC = 1;

  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentLyricSentence: '',
        currentShow: SHOW_CD,
        residueTime: 0,
        playPercent: 0,
        circleArea: 32
      };
    },
    created() {
      this.touch = {};
    },
    components: {
      'scroll': Scroll,
      'progress-bar': ProgressBar,
      'progress-circle': ProgressCircle
    },
    methods: {
      middleTouchStart(event) {
        this.touch.touchStart = true;
        this.touch.startX = event.touches[0].pageX;
        this.touch.startY = event.touches[0].pageY;
      },
      middleTouchMove(event) {
        if(!this.touch.touchStart) {
          return;
        }
        let touch = event.touches[0];
        let deltaX = touch.pageX - this.touch.startX;
        let deltaY = touch.pageY - this.touch.startY;

        // 当向上滚动歌词列表的时候 不进行界面的切换
        if(Math.abs(deltaX) < Math.abs(deltaY)) {
          return;
        }
        // 定义此时歌词列表距离自身左边的距离 即当前歌词列表距离屏幕最右侧边界的距离
        // 如果此时是 cd 显示 那么它的距离就是0
        // 如果此时不是cd 显示 那么它的距离就是 -window.innerWidth 即此时它就显示在视窗中央
        let offsetLeft = this.currentShow === SHOW_CD ? 0 : -window.innerWidth;
        let moveDistance = Math.min(0, Math.max(-window.innerWidth, offsetLeft + deltaX));
        this.touch.movePercent = Math.abs(moveDistance / window.innerWidth);
        this.$refs.lyricScroll.$el.style[transform] = `translate3d(${moveDistance}px,0,0)`;
        this.$refs.cdWrapper.style.opacity = 1 - this.touch.movePercent;
      },
      middleTouchEnd() {
        let offsetLeft;
        let opacityPercent;
        if(this.currentShow === SHOW_CD) {
          if(this.touch.movePercent > 0.1) {
            offsetLeft = -window.innerWidth;
            opacityPercent = 0;
            this.$refs.cdWrapper.style.opacity = opacityPercent;
            this.currentShow = SHOW_LYRIC;
          }else {
            offsetLeft = 0;
          }
        }else {
          if(this.touch.movePercent < 0.8) {
            offsetLeft = 0;
            opacityPercent = 1;
            this.$refs.cdWrapper.style.opacity = opacityPercent;
            this.currentShow = SHOW_CD;
          }else {
            offsetLeft = -window.innerWidth;
          }
        }
        let time = 300;
        this.$refs.lyricScroll.$el.style[transform] = `translate3d(${offsetLeft}px,0,0)`;
        this.$refs.lyricScroll.$el.style[transitionDuration] = `${time}ms`;
      },
      back() {
        this.setFullScreen(false);
      },
      toFullScreen() {
        this.setFullScreen(true);
      },
      togglePlay() {
        this.setPlayingStatus(!this.playing);
        if(this.currentLyric) {
          this.currentLyric.togglePlay();
        }
      },
      prevSong() {
        if(!this.songReady) {
          return;
        }
        if(this.playList.length === 1) {
          // 如果此时的歌单列表只有一首歌 那么调用loop 函数
          this.loop();
        }else {
          let index = this.currentIndex - 1;
          if(index === -1) {
            index = this.playList.length - 1;
          }
          this.setCurIndex(index);
        }
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
        if(this.playList.length === 1) {
          // 如果此时的歌单列表只有一首歌 那么调用loop 函数
          this.loop();
        }else {
          let index = this.currentIndex + 1;
          if(index === this.playList.length) {
            index = 0;
          }
          this.setCurIndex(index);
        }
        // 如果此时是暂停播放状态 将他转变为播放状态
        if(!this.playing) {
          this.togglePlay();
        }
        this.songReady = false;
      },
      ready() {
        this.songReady = true;
      },
      error() {
        this.songReady = true;
      },
      updateTime(event) {
        this.currentTime = event.target.currentTime;
        this.playPercent = (this.currentTime | 0) / this.currentSong.duration;
        this.residueTime = this.currentSong.duration - (this.currentTime | 0);
      },
      end() {
        if(this.mode === playerMode.loop) {
          this.loop();
          return;
        }
        this.setCurIndex(this.currentIndex + 1);
      },
      loop() {
        this.currentTime = 0;
      },
      progressChange(newPercent) {
        let currentTime = this.currentSong.duration * newPercent;
        this.$refs.audio.currentTime = currentTime;
        this.currentLyric.seek(currentTime * 1000);
        if(!this.playing) {
          this.togglePlay();
        }
      },
      changeMode() {
        let mode = (this.mode + 1) % 3;
        this.setPlayMode(mode);
        let list = null;

        if(this.mode === playerMode.random) {
          list = shuffle(this.playList);
        }else {
          list = this.sequenceList;
        }
        this._resetCurrentIndex(list);
        this.setPlayList(list);
      },
      getSongLyric() {
        this.currentSong.getSongLyric().then((lyric) => {
            this.currentLyric = new LyricParse(lyric, this.lyricHandler);
            console.log(this.currentLyric);
            if(this.playing) {
              this.currentLyric.play();
            }
        });
      },
      lyricHandler({lineNum, txt}) {
        this.currentLineNum = lineNum;
        this.currentLyricSentence = txt;
        if(lineNum > 5) {
          let curLyricElem = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricScroll.scrollToElement(curLyricElem, 1000);
        }
      },
      _resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id;
        });
        this.setCurIndex(index);
      },
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
        setCurIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_MODE',
        setPlayList: 'SET_PLAY_LIST'
      })
    },
    watch: {
      currentSong(newSong, oldSong) {
        if(newSong.id === oldSong.id) {
          return;
        }
        if(this.currentLyric) {
          this.currentLyric.seek(0);
          this.currentLyric.stop();
          this.$refs.lyricScroll.scrollToElement(this.$refs.lyricLine[0], 1000);
        }
        // 防止微信从后台切换为前台的时候 歌曲不能播放
        setTimeout(() => {
          this.$refs.audio.play();
          this.getSongLyric();
        }, 1000);
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
      disabled() {
        return this.songReady ? '' : 'disable';
      },
      modeIcon() {
        return this.mode === playerMode.sequence ? 'icon-sequence' : this.mode === playerMode.loop ? 'icon-loop' : 'icon-random';
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'sequenceList',
        'currentSong',
        'currentIndex',
        'playing',
        'mode'
      ])
    },
    filters: {
      formatTime(time) {
        let minutes = (time / 60 | 0) + '';
        let second = (time % 60 | 0) + '';

        second = second.padStart(2, '0');

        return `${minutes}:${second}`;
      }
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
        .player-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .player-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
        .full-screen-lyric-wrapper
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .full-screen-lyric
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .lyric-text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            color: $color-text
            font-size: $font-size-small
            &.time-l
              padding-right: 10px
              text-align: left
            &.time-r
              padding-left: 10px
              text-align: right
          .progress-bar-wrapper
            flex: 1
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
        .mini-progress-bar
          position: absolute
          top: 0
          left: 0
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          position: absolute
          left: 0
          top: 0
          font-size: 32px

  @keyframes rotate
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(360deg)
</style>
