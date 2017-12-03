// 歌曲收据类
export default class Song {
  constructor({id, mid, name, singer, album, duration, image, url}) {
      this.id = id;
      this.mid = mid;
      this.name = name;
      this.singer = singer;
      this.album = album;
      this.duration = duration;
      this.image = image;
      this.url = url;
  };
};

export function createSong(songData) {
  return new Song({
    id: songData.songid,
    mid: songData.songmid,
    name: songData.songname,
    singer: serilizeSinger(songData.singer),
    album: songData.albumname,
    duration: songData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${songData.songid}.m4a?fromtag=46`
  });
};

// 格式化歌手数据函数
// @param {Array} singers - 获取的歌手数据会是一个歌手的数组
function serilizeSinger(singers) {
  let result = [];
  if (!singers) {
    return '';
  }
  singers.forEach((singer) => {
    result.push(singer.name);
  });
  return result.join('/');
}
