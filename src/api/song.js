import {commonParams} from 'api/config.js';
import axios from 'axios';

export function getLyric(id) {
  const url = '/lyric';

  const params = Object.assign({}, commonParams, {
    nobase64: 0,
    musicid: id,
    songtype: 0,
    callback: 'jsonp'
  });

  return axios.get(url, {
    params
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
