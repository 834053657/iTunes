// 请勿在此引用静态文件 因为会影响到mock 执行
import moment from 'moment';
import numeral from 'numeral';
import AsyncValidator from 'async-validator';
import { parse } from 'qs';
import { size, map } from 'lodash';
import { getLocale } from './authority';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function getSystemUrl(env) {
  let base_url = 'http://47.106.111.213:3000/mock/19';
  let socket_url = 'http://47.106.111.213:9000/socket.io';
  let web_name = '凯歌交易平台';

  const language = getLocale();
  if (language === 'en-GB') web_name = 'Kaige Trading Platform';

  if (env === 'dev') {
    base_url = 'http://47.106.111.213:3000/mock/19';
    web_name += '(DEV)';
    // socket_url = 'http://localhost:3000/socket/push';
    socket_url = 'http://47.106.111.213:9000/socket.io';
  } else if (env === 'test1') {
    base_url = 'http://47.106.111.213:9003'; // 深圳开发测试环境
    web_name += '(DEV)';
    // socket_url = 'http://localhost:3000/socket/push';
    socket_url = 'http://47.106.111.213:9065/socket.io'; // // 深圳开发测试环境
  } else if (env === 'test2') {
    base_url = 'http://47.106.111.213:9001'; // 业务测试环境
    web_name += '(TEST)';
    // socket_url = 'http://localhost:3000/socket/push';
    socket_url = 'http://47.106.111.213:9000/socket.io';
  }

  return { base_url, web_name, socket_url };
}

export function playAudio() {
  const audio = document.createElement('audio');
  audio.src = require('../../public/audio/msg.mp3');
  audio.play();
}

export function formatMoney(rmb) {
  return numeral(rmb || 0).format('0,0.00');
}

export function parseNumber(value) {
  return !value || isNaN(Number(value)) ? null : Number(value);
}

/**
 * 获取queryString
 * @param queryString字符串
 * @returns {*|{}}
 */
export function getQueryString(str_) {
  const str = str_.replace('?', '');
  return parse(str) || {};
}

export function createError(obj, keyPath, value) {
  //匹配出属性名
  const array = keyPath.match(/\w+/g);
  let i = 0;
  //遍历属性名数组
  for (; i < array.length - 1; i++) {
    const cur = array[i];
    const next = array[i + 1];
    //如果当前路径并没有相应对象
    //就创建对象
    if (!obj[cur]) {
      //如果要创建的是对象
      if (isNaN(next)) {
        obj[cur] = {};
      } else {
        //如果要创建的是数组
        obj[cur] = [];
      }
    }
    //obj指向新创建的对象
    obj = obj[cur];
  }
  //最后一步赋值
  obj[array[i]] = value;
}

export function validate(rules, values) {
  const validator = new AsyncValidator(rules);
  let ret;

  validator.validate(values, (errors, fields) => {
    if (size(errors) > 0) {
      ret = {};
      errors.forEach(err => {
        createError(ret, err.field, err.message);
      });
    }
  });
  // console.log(ret);
  return ret;
}
