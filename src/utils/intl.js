import { addLocaleData } from 'react-intl';
import moment from 'moment';
import appLocaleEn from '../locales/en-US';
import appLocaleZh from '../locales/zh-Hans-CN';

import { getLocale } from './authority';

const getAppLocale = () => {
  const lang = getLocale() || 'zh';
  let appLocale = null;

  switch (lang) {
    case 'en-GB':
      addLocaleData(appLocaleEn.data);
      moment.locale('en');
      appLocale = appLocaleEn;
      break;
    case 'zh-CN':
      addLocaleData(appLocaleZh.data);
      require('moment/locale/zh-cn');
      moment.locale('zh-cn');
      appLocale = appLocaleZh;
      break;
    default:
      require('moment/locale/zh-cn');
      moment.locale('zh-cn');
      appLocale = appLocaleZh;
      break;
  }

  return appLocale;
};

const getLang = () => {
  return getLocale() || 'zh';
};

export default {
  getAppLocale,
  getLang,
};
