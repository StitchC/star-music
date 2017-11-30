// 格式化歌手数据类
// 返回一个对象 对象包括歌手的id，歌手名，以及头像url

export default class {
  constructor(mid, uid, name) {
    this.user_mid = mid;
    this.user_id = uid;
    this.name = name;
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.user_mid}.jpg?max_age=2592000`;
  }
}
