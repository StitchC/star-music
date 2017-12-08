// vuex action 配置
// 提交多个mutation
import * as types from './mutation-types';
import {playerMode} from 'common/js/config.js';
import {shuffle} from 'common/js/util.js';

export const selectPlay = function({commit}, {list, index}) {
  // 当点击音乐列表的时候提交多个mutation

  // 1. 设置播放状态为true
  commit(types.SET_PLAYING_STATE, true);
  // 2. 设置播放器为全屏状态
  commit(types.SET_FULL_SCREEN, true);
  // 3. 设置播放列表数据
  commit(types.SET_PLAY_LIST, list);
  // 4. 设置顺序播放列表数据
  commit(types.SET_SEQUENCE_LIST, list);
  // 5. 设置当前播放歌曲的索引
  commit(types.SET_CURRENT_INDEX, index);
  // 6. 设置当前播放顺序为列表循环播放
  commit(types.SET_MODE, playerMode.sequence);
};

export const setRandomPlay = function({commit}, {list}) {
  // 拷贝一个list 的副本 避免随机排序的时候影响到原本的数据
  let tempList = [...list];
  console.log(tempList);
  let randomList = null;
  randomList = shuffle(tempList);

  // 1. 设置播放状态为true
  commit(types.SET_PLAYING_STATE, true);
  // 2. 设置播放器为全屏状态
  commit(types.SET_FULL_SCREEN, true);
  // 3. 设置播放列表数据
  commit(types.SET_PLAY_LIST, randomList);
  // 4. 设置顺序播放列表数据
  commit(types.SET_SEQUENCE_LIST, list);
  // 5. 设置当前播放歌曲的索引
  commit(types.SET_CURRENT_INDEX, 0);
  // 6. 设置当前播放顺序为列表循环播放
  commit(types.SET_MODE, playerMode.random);
};
