import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getAuthority, getLocale } from '../utils/authority';
import { getMenuData } from './menu';

const lang = getLocale().replace('-', '_');
let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

function checkLogined() {
  const user = getAuthority();
  return !!(user && user.token);
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/home': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Home')),
    },
    // 帮助，隐私，条款路由控制
    '/information/help': {
      component: dynamicWrapper(app, ['information'], () => import('../routes/Information/Help')),
    },
    '/information/privacy': {
      component: dynamicWrapper(app, ['information'], () =>
        import('../routes/Information/Privacy')
      ),
    },
    '/information/terms': {
      component: dynamicWrapper(app, ['information'], () => import('../routes/Information/Terms')),
    },
    '/information/duty': {
      component: dynamicWrapper(app, ['information'], () => import('../routes/Information/Duty')),
    },
    '/user-center/index': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/UserCenter/UserCenterPage')),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/user-center/g2validate': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/UserCenter/G2ValidatePage')),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    // 我的广告
    '/ad/my': {
      component: dynamicWrapper(app, ['ad'], () => import('../routes/Ad/MyAdList')),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/ad/terms': {
      component: dynamicWrapper(app, ['ad'], () => import('../routes/Ad/MyTermsList')),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/order/my': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/UserCenter/MyOrderList')),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    // 资讯消息路由控制
    '/message/info-list': {
      component: dynamicWrapper(app, ['message'], () => import('../routes/Message/InfoList')),
    },
    '/message/info-detail/:id': {
      component: dynamicWrapper(app, ['message'], () => import('../routes/Message/InfoDetail')),
    },
    '/card/market': {
      component: dynamicWrapper(app, ['card'], () => import('../routes/GiftCard/List')),
    },
    '/message/list': {
      component: dynamicWrapper(app, ['message'], () => import('../routes/Message/List')),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/card/sell-card': {
      component: dynamicWrapper(app, ['card_ad', 'card'], () =>
        import('../routes/GiftCard/SellCard')
      ),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/card/edit-sell-card/:id/:action': {
      component: dynamicWrapper(app, ['card_ad', 'card'], () =>
        import('../routes/GiftCard/SellCard')
      ),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/card/buy-card': {
      component: dynamicWrapper(app, ['card_ad', 'card'], () =>
        import('../routes/GiftCard/BuyCard')
      ),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/card/edit-buy-card/:id/:action': {
      component: dynamicWrapper(app, ['card_ad', 'card'], () =>
        import('../routes/GiftCard/BuyCard')
      ),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/card/deal-detail/:id': {
      component: dynamicWrapper(app, ['card'], () => import('../routes/GiftCard/DealDetail')),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/card/deal-line/:id': {
      component: dynamicWrapper(app, ['card'], () => import('../routes/GiftCard/DealLine')),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    // '/card/a_detail': {
    //   component: dynamicWrapper(app, ['card'], () => import('../routes/GiftCard/Ad/PreviewAd')),
    // },
    '/wallet': {
      component: dynamicWrapper(app, ['user', 'wallet'], () => import('../routes/Wallet/Layout')),
      authority: checkLogined,
      redirectPath: '/user/login',
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/forget-password': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/User/ForgetPassword')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/user/forget-password-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/ForgetPasswordResult')),
    },
    '/user/change-password-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/ChangePasswordResult')),
    },
    '/user/change-password/:code': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/User/ChangePassword')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },

    // '/form/step-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/index')),
    // },
    // '/form/step-form/info': {
    //   name: '分步表单（填写转账信息）',
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    // },
    // '/form/step-form/confirm': {
    //   name: '分步表单（确认转账信息）',
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    // },
    // '/form/step-form/result': {
    //   name: '分步表单（完成）',
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    // },
    // '/form/advanced-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    // },
    // '/list/table-list': {
    //   component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    // },
    // '/list/basic-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    // },
    // '/list/card-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    // },
    // '/list/search': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    // },
    // '/list/search/projects': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    // },
    // '/list/search/applications': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    // },
    // '/list/search/articles': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    // },
    // '/profile/basic': {
    //   component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    // },
    // '/profile/advanced': {
    //   component: dynamicWrapper(app, ['profile'], () =>
    //     import('../routes/Profile/AdvancedProfile')
    //   ),
    // },
    // '/result/success': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    // },
    // '/result/fail': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    // },
    // '/exception/trigger': {
    //   component: dynamicWrapper(app, ['error'], () =>
    //     import('../routes/Exception/triggerException')
    //   ),
    // },
    // '/dashboard/analysis': {
    //   component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    //   authority: checkLogined,
    //   redirectPath: '/user/login',
    // },
    // '/dashboard/monitor': {
    //   component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    // },
    // '/dashboard/workplace': {
    //   component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
    //     import('../routes/Dashboard/Workplace')
    //   ),
    //   // hideInBreadcrumb: true,
    //   // name: '工作台',
    //   // authority: 'admin',
    // },
    // '/form/basic-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    // },
    // // '/form/zan-form': {
    // //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/ZanForm')),
    // // },
    // '/form/redux-form': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Forms/ReduxForm')),
    // },
  };

  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  // console.log(menuData)

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem[`name_${lang}`] || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
