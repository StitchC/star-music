<template>
  <div class="recommend-wrapper">
    <scroll ref="scroll" class="recommend-content" :data="songListData">
      <div>
        <div class="slider-wrapper">
          <slider :data="sliderData">
            <div v-for="(item, index) in sliderData">
              <a :href="item.linkUrl">
                <img @load="imgOnload" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="recommend-list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in songListData" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" with="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-wrapper" v-show="!songListData.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider.vue';
  import {getRecommend, getSongList} from 'api/getRecommend.js';
  import {ERR_OK} from 'api/config.js';
  import Scroll from 'base/scroll/scroll.vue';
  import Loading from 'base/loading/loading.vue';

  export default {
    data() {
      return {
        sliderData: [],
        songListData: []
      };
    },
    created() {
      this._getRecommend();
      this._getSongList();
    },
    destroyed() {
      clearTimeout(this.timer);
    },
    components: {
      slider: Slider,
      scroll: Scroll,
      loading: Loading
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.sliderData = res.data.slider;
          }
        });
      },
      _getSongList() {
        getSongList().then((res) => {
          if(res.code === ERR_OK) {
            this.songListData = res.data.list;
          }
        });
      },
      imgOnload() {
        // slider 图片加载完成的时候调用这个函数
        // 这个方法会调用滚动组件 scroll 的 refresh 方法 刷新组件重新计算属性
        if(!this.isCheckedLoad) {
          this.$refs.scroll.refresh();
          this.isCheckedLoad = true;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .recommend-wrapper
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .recommend-content
      height: 100%
      overflow: hidden
      .recommend-list
        .recommend-list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          align-items: center
          box-sizing: border-box
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex: 1
            flex-direction: column
            justify-content: center
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
    .loading-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
