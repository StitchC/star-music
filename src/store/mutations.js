/* vuex mutation 配置 */
import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PALY_LIST](state, playList) {
    state.playList = playList;
  },
  [types.SET_SEQUENCE_LIST](state, sequenceList) {
    state.sequenceList = sequenceList;
  },
  [types.SET_MODE](state, playMode) {
    state.mode = playMode;
  },
  [types.SET_CURRENT_INDEX](state, curIndex) {
    state.currentIndex = curIndex;
  }
};

export default mutations;
