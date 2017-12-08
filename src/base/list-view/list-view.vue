<template>
  <scroll class="list-view" :data="data"
          :listen-scroll="listenScroll"
          :probeType="probeType"
          ref="scroll"
          @scroll="onScroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="groups">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" @click="selectItem($event, item)" v-for="item in group.items">
            <img v-lazy="item.avatar" class="avatar">
            <span class="singer-name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut-list-wrap" @touchstart.stop="onSelectShortcut" @touchmove.stop.prevent="onMoveShortcut">
      <ul>
        <li v-for="(item, index) in shortcutList" class="shortcur-list-item" :class="{'active': currentIndex === index}" :data-index="index">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle !== ''" ref="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="data.length > 0">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll.vue';
  import Loading from 'base/loading/loading.vue';
  import {dataAttribute} from 'common/js/dom.js';

  const ANCHOR_HEIGHT = 18; // 侧边快速入口栏每个字符的高度
  const TITLE_HEIGHT = 30;  // 固定标题栏的高度

  export default {
    data() {
      return {
        listenScroll: true,
        scrollY: 0,
        currentIndex: 0,
        everGroupsHeigh: [],
        diff: -1,   // 固定标题的滚动距离
        probeType: 3
      };
    },
    created() {
      // 在created 的时候创建一个保存手指触摸以及移动位置的对象
      // 令其共享在 touchstart 和 touchmove 事件之间
      this.saveTouchPos = {};
    },
    props: {
      data: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1);
        });
      },
      fixedTitle() {
        if(this.scrollY > 0) {
          return '';
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    components: {
      scroll: Scroll,
      loading: Loading
    },
    methods: {
      refresh() {
        this.$refs.scroll.refresh();
      },
      selectItem(e, item) {
        this.$emit('select', item);
      },
      onSelectShortcut(e) {
        let anchorIndex = dataAttribute(e.target, 'index');
        let firstTouchPos = e.touches[0];            // 保存第一个触碰点
        this.saveTouchPos.y1 = firstTouchPos.pageY;  // 共享手指触碰到屏幕时的y 轴位置
        this.saveTouchPos.anchorIndex = anchorIndex; // 共享手指触碰的锚点下标
        this._moveToElem(anchorIndex);
      },
      onMoveShortcut(e) {
        let firstTouchPos = e.touches[0];
        this.saveTouchPos.y2 = firstTouchPos.pageY; // 保存手指在屏幕滑动时的y 轴位置
        // 计算手指按下与滑动之间的位置差值再除以每一个侧边栏锚点的高度 便得出现在滑动到第几个锚点
        let posDiff = (this.saveTouchPos.y2 - this.saveTouchPos.y1) / ANCHOR_HEIGHT | 0; // 或运算相当于向下取整
        let targetIndex = parseInt(this.saveTouchPos.anchorIndex) + posDiff; // 保存应当移动的第几个锚点索引
        this._moveToElem(targetIndex);
      },
      onScroll(pos) {
        this.scrollY = pos.y;
      },
      _moveToElem(pos) {
        if(pos === null || pos > this.data.length - 1) {
          return;
        }
        this.currentIndex = parseInt(pos);
        this.$refs.scroll.scrollToElement(this.$refs.groups[pos], 0);
      },
      _calculateHeight() {
        setTimeout(() => {
          let groups = this.$refs.groups;
          let height = 0;
          this.everGroupsHeigh.push(height);
          for(let i = 0; i < groups.length; i++) {
            let item = groups[i];
            height += item.offsetHeight;
            this.everGroupsHeigh.push(height);
          }
        }, 20);
      }
    },
    watch: {
      data() {
        // 计算出每一个分组的高度
        this._calculateHeight();
      },
      scrollY(newVal) {
        let val = -newVal;
        let listHeight = this.everGroupsHeigh;
        // 如果val 小于0 表示scroll 滑到了最顶部
        // 那么currentIndex = 0
        if(val < 0) {
          this.currentIndex = 0;
          return;
        }
        // 如果scroll 在中间部分滚动 那么遍历数组找出对应的位置
        for(let i = 0; i < listHeight.length - 1; i++) {
          let upperLimit = listHeight[i + 1];
          let lowerLimit = listHeight[i];
          if (val > lowerLimit && val < upperLimit) {
            this.currentIndex = i;
            this.diff = upperLimit + newVal;
            break;
          }else {
            this.currentIndex = 0;
          }
        }
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        // 创建一个属性 保存当前固定标题位移的距离
        if(this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
        this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .list-view
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background-color: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .singer-name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .shortcut-list-wrap
      position: absolute
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      z-index: 20
      .shortcur-list-item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.active
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
</style>
