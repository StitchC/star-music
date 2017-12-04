// vuex action 配置
// 提交多个mutation
import * as types from './mutation-types';

export const selectPlay = function({commit, state}, {list, index}) {
  // 当点击音乐列表的时候提交多个mutation
  
  // 1. 设置播放状态为true
  commit(types.SET_PLAYING_STATE, true);
  // 2. 设置播放器为全屏状态
  commit(types.SET_FULL_SCREEN, true);
  // 3. 设置播放列表数据
  commit(types.SET_PALY_LIST, list);
  // 4. 设置顺序播放列表数据
  commit(types.SET_SEQUENCE_LIST, list);
  // 5. 设置当前播放歌曲的索引
  commit(types.SET_CURRENT_INDEX, index);
};
