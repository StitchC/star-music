<template>
  <div class="wrapper" ref="scroll">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 滚动组件
   *
   * @param {Number} probeType - 控制better-scroll probeType 属性 默认: 1
   *
   * @param {Boolean} click - 设置better-scroll 是否可以点击 默认: true
   *
   * @param {Array} data - 加载到滚动组件的数据 以便监听数据的变化刷新 better-scroll
   * */

  import Bscroll from 'better-scroll';

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll();
      }, 20);
    },
    methods: {
      _initScroll() {
        if(!this.$refs.scroll) {
          // 如果实例化 better-scroll 的时候还没有加载完成dom 隔20毫秒再调用一次
          setTimeout(() => {
            this._initScroll();
          }, 20);
        }
        this.scroll = new Bscroll(this.$refs.scroll, {
          probeType: this.probeType,
          click: this.click
        });
      },
      enabled() {
        this.scroll.enable();
      },
      disabled() {
        this.scroll.disable();
      },
      refresh() {
        this.scroll.refresh();
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh();
        }, 20);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
