<template>
  <div class="slider" ref="sliderWrap">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{'active': currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 基础组件: slider 轮播组件
   *
   * @param {Boolean} isReady - 考虑到插槽里面的元素可能是一个异步过程 所以当插槽元素异步获取完毕之后将这个参数设置为 true 组件内部便会设置插槽内部的元素的样式，默认值为false
   * @param {Boolean} loop - 设定轮播插件是否循环轮播 默认为true
   * @param {Boolean} autoPlay - 设定轮播组件是否自动播放 默认为true
   * @param {Number} interval - 设定轮播组件的切换间隔时间 默认为 4000(毫秒)
   * */

  import BetterScroll from 'better-scroll';
  import {addClass} from 'common/js/dom.js';

  export default {
    data() {
      return {
        dots: null,
        currentPageIndex: 0
      };
    },
    props: {
      isReady: {
        type: Boolean,
        default: false
      },
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    methods: {
      _setSliderWidth(isResize) {
        let sliderGroups = this.$refs.sliderGroup.children;
        let width = 0;
        let sliderWidth = this.$refs.sliderWrap.offsetWidth;
        // 遍历所有的slider item 为其添加类名
        for(let i = 0; i < sliderGroups.length; i++) {
          addClass(sliderGroups[i], 'slider-item');
          sliderGroups[i].style.width = sliderWidth + 'px';
          width += sliderGroups[i].offsetWidth;
        }
        // 如果用户设置为了轮播 且 不是窗口resize事件时才会对sliderGroup 添加额外宽度
        if(this.loop && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      _initSlider() {
        this.bScroll = new BetterScroll(this.$refs.sliderWrap, {
          scrollY: false,
          scrollX: true,
          momentum: false,
          snap: {
            loop: true
          },
          snapLoop: true,
          snapThreshold: 0.5,
          snapSpeed: 0.8
        });
        // 为scroll 对象绑定 scrollEnd 事件 每次滚动完更新 currentPageIndex 的数值
        this.bScroll.on('scrollEnd', () => {
          // better-scroll getCurrentPage.pageX 得出的结果不是栈的方式
          // 而是 1 2 3 4... 这样的数字所以如果是轮播的话 pageIndex 需要减1 才能和 dot 对应
          let pageIndex = this.bScroll.getCurrentPage().pageX;
          if(this.loop) {
            pageIndex -= 1;
          }
          this.currentPageIndex = pageIndex;
          if(this.autoPlay) {
            clearTimeout(this.timer);
            this._autoPlay();
          }
        });
      },
      _initdots() {
        let dotsCount = this.$refs.sliderGroup.children.length;
        this.dots = new Array(dotsCount);
      },
      _autoPlay() {
        // 因为currentPageIndex 为了和 dot 的index 对应所以减了1
        // 因此在调用goToPage 方法的时候又需要切换为 better-scroll 的规则
        // 则 currentPageIndex 需要 +1
        let pageIndex = this.currentPageIndex + 1;
        if(this.loop) {
          pageIndex += 1;
        }
        this.timer = setTimeout(() => {
          this.bScroll.goToPage(pageIndex, 0, 800);
        }, this.interval);
      }
    },
    watch: {
      isReady(val) {
        setTimeout(() => {
          this._setSliderWidth();
          this._initdots();
          this._initSlider();
          if(this.autoPlay) {
            this._autoPlay();
          }
          window.addEventListener('resize', () => {
            if(!this.bScroll) {
              return;
            }
            this._setSliderWidth(true);
            this.bScroll.refresh();
          });
        }, 20);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"

  .slider
    position: relative
    min-height: 1px
    overflow: hidden
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      clear-fix()
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      left: 0
      right: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        width: 8px
        height: 8px
        margin: 0 4px
        border-radius: 50%
        background-color: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background-color: $color-text-ll
</style>
