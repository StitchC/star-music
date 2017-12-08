/* vue 实例mixin */
import {mapGetters} from 'vuex';

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList(newVal) {
      this.handlerPlayList(newVal);
    }
  },
  methods: {
    handlerPlayList() {
      throw new Error('component must implement the handlerPlayList method');
    }
  }
};
