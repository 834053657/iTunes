import antdEn from 'antd/lib/locale-provider/en_US';
import appLocaleDataEn from 'react-intl/locale-data/en';
import enMessages from './en.json';


// let ENmessage = {};
//   for(let id in enMessages ) {
//     if (enMessages[id]) {
//       ENmessage[id] = enMessages[id].substring(0, 1).toUpperCase() + enMessages[id].substring(1);
//     }
//   }

const appLocaleEn = {
  messages: {
    ...enMessages,
  },
  antd: antdEn,
  locale: 'en-US',
  data: appLocaleDataEn,
};

export default appLocaleEn;
