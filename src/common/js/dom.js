/**
 * 操作 dom 的一些js 方法
 * */

// 为元素添加className
export function addClass(el, newClass) {
  if(hasClass(el, newClass)) {
    // 如果元素已经存在这个classnName 则返回
    return;
  }
  let classList = el.className.split(' ');
  classList.push(newClass);
  el.className = classList.join(' ');
}

// 判断元素是否已经存在这个className
export function hasClass(el, className) {
  return el.className.indexOf(className) > 0;
}

// dom 操作data 自定义属性
export function dataAttribute(el, name, val) {
  const prefix = 'data-';
  name = prefix + name;
  if(val) {
    return el.setAttribute(name, val);
  }else {
    return el.getAttribute(name);
  }
}
