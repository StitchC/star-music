<template>
  <div class="singer-wrapper" ref="wrap">
    <list-view :data="singerList" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer.js';
  import {ERR_OK} from 'api/config.js';
  import Singer from 'common/js/Singer.js';
  import listView from 'base/list-view/list-view.vue';
  import {mapMutations, mapGetters} from 'vuex';  // vuex 语法糖
  import {playListMixin} from 'common/js/mixin.js';

  const MINI_PLAYER_HEIGHT = 60; // 迷你播放器的高度
  const HOT_SINGER_TITLE = '热门'; // 热门歌手分类的标题
  const HOT_SINGER_LEN = 10; // 热门歌手的数量

  export default {
    mixins: [playListMixin],
    data() {
      return {
        singerList: []
      };
    },
    created() {
      this._getSingerList();
    },
    components: {
      'list-view': listView
    },
    computed: {
      ...mapGetters([
        'playList'
      ])
    },
    methods: {
      handlerPlayList(playList) {
        const height = playList.length > 0 ? MINI_PLAYER_HEIGHT + 'px' : '';
        this.$refs.wrap.style.bottom = height;
        this.$refs.list.refresh();
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.user_id}`
        });
        this.setSinger(singer);
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if(res.code === ERR_OK) {
            let tempData = res.data;
            this.singerList = this._normalizeSinger(tempData.list);
            console.log(this.singerList);
          }
        });
      },
      _normalizeSinger(list) {
        // 整理歌手原始数据为我们需要的数据格式
        // 创建一个singerMap 对象
        // 数据格式为： 对应分类的key key 的值又是一个对象 对象有两个key，title(当前分类的标题) items(当前分类的数据)
        let singerMap = {
          hot: {
            title: HOT_SINGER_TITLE,
            items: []
          }
        };

        list.forEach((val, index) => {
          if(index < HOT_SINGER_LEN) {
            singerMap.hot.items.push(new Singer(val.Fsinger_mid, val.Fsinger_id, val.Fsinger_name));
          }
          // 获取歌手名的首字母
          let key = val.Findex;
          if(!singerMap[key]) {
            singerMap[key] = {
              title: key,
              items: []
            };
            singerMap[key].items.push(new Singer(val.Fsinger_mid, val.Fsinger_id, val.Fsinger_name));
          }else {
            singerMap[key].items.push(new Singer(val.Fsinger_mid, val.Fsinger_id, val.Fsinger_name));
          }
        });

        // 因为整理的map 是一个无序列表 所以必须整理为数组
        let hot = [];     // 保存热门歌手
        let normal = [];  // 保存歌手名首字母 a-z 序列的歌手
        let spec = [];    // 保存歌手名以特殊字符开头的歌手
        spec.push({
          title: '#',
          items: []
        });
        for(let key in singerMap) {
          let val = singerMap[key];
          if (val.title === HOT_SINGER_TITLE) {
            hot.push(val);
          }else if(val.title.match(/[a-zA-Z]/)) {
            normal.push(val);
          }else {
            spec[0].items = spec[0].items.concat(val.items);
          }
        }

        normal = normal.sort((val1, val2) => {
          return val1.title.charCodeAt(0) - val2.title.charCodeAt(0);
        });

        return hot.concat(normal, spec);
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer-wrapper
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
