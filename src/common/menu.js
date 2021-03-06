import { isUrl } from '../utils/utils';

let menuData = [
  {
    name: '首页',
    name_en_GB: 'Home',
    path: 'home',
  },
  // {
  //   name: 'Itunes',
  //   path: 'itunes',
  //   hide: true,
  //   children: [
  //     {
  //       name: '交易大厅',
  //       path: 'itunes-markets',
  //     },
  //     {
  //       name: '账号管理',
  //       path: 'account-manage',
  //     },
  //   ],
  // },
  {
    name: '礼品卡',
    name_en_GB: 'Gift Card',
    path: 'card',
    children: [
      {
        name: '交易大厅',
        name_en_GB: 'Trading Hall',
        path: 'market',
      },
      {
        name: '发布购买广告',
        name_en_GB: 'Create Purchase Ad',
        path: 'buy-card',
      },
      {
        name: '发布出售广告',
        name_en_GB: 'Create Sale Ad',
        path: 'sell-card',
      },
    ],
  },
];

// if (__KG_API_ENV__ === 'dev') {
//   menuData.push(
//     {
//       name: 'dashboard',
//       icon: 'dashboard',
//       path: 'dashboard',
//       children: [
//         {
//           name: '分析页',
//           path: 'analysis',
//         },
//         {
//           name: '监控页',
//           path: 'monitor',
//         },
//         {
//           name: '工作台',
//           path: 'workplace',
//           // hideInBreadcrumb: true,
//           // hideInMenu: true,
//         },
//       ],
//     },
//     {
//       name: '表单页',
//       icon: 'form',
//       path: 'form',
//       children: [
//         {
//           name: '基础表单',
//           path: 'basic-form',
//         },
//         {
//           name: '分步表单',
//           path: 'step-form',
//         },
//         {
//           name: '高级表单',
//           // authority: 'admin',
//           path: 'advanced-form',
//         },
//       ],
//     },
//     {
//       name: '列表页',
//       icon: 'table',
//       path: 'list',
//       children: [
//         {
//           name: '查询表格',
//           path: 'table-list',
//         },
//         {
//           name: '标准列表',
//           path: 'basic-list',
//         },
//         {
//           name: '卡片列表',
//           path: 'card-list',
//         },
//         {
//           name: '搜索列表',
//           path: 'search',
//           children: [
//             {
//               name: '搜索列表（文章）',
//               path: 'articles',
//             },
//             {
//               name: '搜索列表（项目）',
//               path: 'projects',
//             },
//             {
//               name: '搜索列表（应用）',
//               path: 'applications',
//             },
//           ],
//         },
//       ],
//     },
//     {
//       name: '详情页',
//       icon: 'profile',
//       path: 'profile',
//       children: [
//         {
//           name: '基础详情页',
//           path: 'basic',
//         },
//         {
//           name: '高级详情页',
//           path: 'advanced',
//           // authority: 'admin',
//         },
//       ],
//     },
//     {
//       name: '结果页',
//       icon: 'check-circle-o',
//       path: 'result',
//       children: [
//         {
//           name: '成功',
//           path: 'success',
//         },
//         {
//           name: '失败',
//           path: 'fail',
//         },
//       ],
//     },
//     {
//       name: '异常页',
//       icon: 'warning',
//       path: 'exception',
//       children: [
//         {
//           name: '403',
//           path: '403',
//         },
//         {
//           name: '404',
//           path: '404',
//         },
//         {
//           name: '500',
//           path: '500',
//         },
//         {
//           name: '触发异常',
//           path: 'trigger',
//           hideInMenu: true,
//         },
//       ],
//     },
//     {
//       name: '账户',
//       name_en_GB: 'Account',
//       icon: 'user',
//       path: 'user',
//       // authority: 'guest',
//       children: [
//         {
//           name: '登录',
//           name_en_GB: 'Login',
//           path: 'login',
//         },
//         {
//           name: '注册',
//           name_en_GB: 'Registration',
//           path: 'register',
//         },
//         {
//           name: '注册结果',
//           name_en_GB: 'Registration Result',
//           path: 'register-result',
//         },
//       ],
//     }
//   );
// }

menuData = menuData.filter(item => !item.hide);

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
