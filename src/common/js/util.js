// 共需js 方法

/*
*
* 获取随机数函数
* @param {Integer} min - 随机数的最小值
* @param {Integer} max - 随机数的最大值
* */
function getRandomIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle(arr) {
  let result = [...arr];
  for(let i = 0; i < result.length; i++) {
    let randomIndex = getRandomIndex(0, i);
    let tmp = result[randomIndex];
    result[randomIndex] = result[i];
    result[i] = tmp;
  }
  return result;
}
