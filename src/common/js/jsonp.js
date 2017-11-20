/**
 *  利用jsonp 库构建一个jsonp 方法
 *
 *  export {function} jsonp
 *  这个方法需要三个参数:
 *    发送请求的url
 *    url 要携带的参数
 *    传递给jsonp 库的option
 * */

import originJsonp from 'jsonp';


// 格式化参数
function formatParams(data) {
  let url = '';
  for(let k in data) {
    let value = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '';
}


export default function jsonp(url, params, option) {
  // 调用整理参数函数 将参数拼入url 中
  url += (url.indexOf('?') < 0 ? '?' : '&') + formatParams(params);
  // 创建一个promise 对象处理异步程序
  return new Promise((resolve, reject) => {
    // 调用 originJsonp 库
    originJsonp(url, option, (err, data) => {
      if(!err) {
        resolve(data);
      }else {
        reject(err);
      }
    });
  });
};

