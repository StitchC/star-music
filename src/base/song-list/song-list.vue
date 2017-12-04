<template>
  <div class="song-list">
    <ul>
      <li class="song-item" @click="select(song, index)" v-for="(song, index) in songList">
        <div class="content">
          <h2 class="song-name">{{song.name}}</h2>
          <p class="song-desc">{{song | formatDesc}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
    /**
     * 音乐通用列表组件
     *
     * @param {Array} songList - 音乐数据
     * */
    export default {
      props: {
        songList: {
          type: Array,
          default: () => {
            return [];
          }
        }
      },
      methods: {
        select(item, index) {
          this.$emit('select', item, index);
        }
      },
      filters: {
        formatDesc(song) {
          return `${song.singer} · ${song.album}}`;
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/variable.styl"

  .song-list
    .song-item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .song-name
          no-wrap()
          color: $color-text
        .song-desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
