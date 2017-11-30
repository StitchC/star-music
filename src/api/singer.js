import jsonp from 'common/js/jsonp.js';
import {commonParams, options} from 'api/config.js';

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

  let params = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  });

  return jsonp(url, params, options);
}

export function getSingerDetails(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
  
  const params = Object.assign({}, commonParams, {
    singerid: singerId,
    uin: 0,
    notice: 0,
    platform: 'h5page',
    needNewCode: 1,
    order: 'listen',
    from: 'h5',
    num: 100,
    begin: 0
  });
  
  return jsonp(url, params, options);
}
