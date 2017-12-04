import {playerMode} from 'common/js/config.js';

const state = {
  singer: {},
  playing: false,    // 播放器播放状态
  fullScreen: false, // 播放器是否全屏
  playList: [],      // 播放器播放列表
  sequenceList: [],  // 播放器播放顺序列表
  mode: playerMode.sequence,  // 播放器播放模式 默认为顺序播放
  currentIndex: -1      // 当前播放音乐的索引
};

export default state;
