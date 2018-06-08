import { stringify } from 'qs';
import request from '../utils/request';

export async function queryBanners() {
  return request('/itunes/info/banners');
}

export async function queryInfoList(params) {
  return request(`/itunes/info/all?${stringify(params)}`);
}

export async function queryInfoDtl(params) {
  return request(`/itunes/info/detail?${stringify(params)}`);
}

export async function queryMessageList(params) {
  return request(`/itunes/message/all?${stringify(params)}`);
}

export async function readMessage(params) {
  return request('/itunes/message/read', {
    method: 'POST',
    body: params,
  });
}

export async function queryMyAdList(params) {
  return request(`/itunes/user/my_ad/all?${stringify(params)}`);
}

export async function queryTermsList(params) {
  return request(`/itunes/user/trans_term/all?${stringify(params)}`);
}

export async function fakeAd(params) {
  return request('/itunes/user/my_ad/update', {
    method: 'POST',
    body: params,
  });
}

export async function removeAd(params) {
  return request('/itunes/user/my_ad/delete', {
    method: 'POST',
    body: params,
  });
}

export async function fakeTerms(params) {
  return request('/itunes/user/trans_term/update', {
    method: 'POST',
    body: params,
  });
}

export async function removeTerms(params) {
  return request('/itunes/user/trans_term/delete', {
    method: 'POST',
    body: params,
  });
}

export async function queryStaticDtl(params) {
  return request(`/itunes/info/static?${stringify(params)}`);
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function accountLogin(params) {
  return request('/itunes/user/login', {
    method: 'POST',
    body: params,
  });
}

// -------------- 注册 start --------------

export async function fakeRegister(params) {
  return request('/itunes/user/register', {
    method: 'POST',
    body: params,
  });
}

export async function postVerify(params) {
  return request('/itunes/user/send_code', {
    method: 'POST',
    body: params,
  });
}

// -------------- 注册 end --------------

export async function postVerifyCaptcha(params) {
  return request('/itunes/user/verify_code', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function queryStatistics() {
  return request('/itunes/statistics/trade');
}
export async function queryConfigs() {
  return request('/itunes/defines');
}

//礼品卡列表actions开始

export async function getBuyCardlist(params) {
  return request(`/itunes/ad/card/buy?${stringify(params)}`);
}

export async function getSellCardlist(params) {
  console.log('params');
  console.log(params);
  return request(`/itunes/ad/card/sell?${stringify(params)}`);
}

//获取交易条款
export async function getTransTerms() {
  return request('/itunes/user/trans_term/all');
}

//getToken
export async function getToken(params) {
  return request('/itunes/user/upload_token', {
    method: 'POST',
    body: params,
  });
}

//创建出售
export async function postSell(params) {
  console.log('post postSell in api');
  return request('/itunes/ad/card/sell', {
    method: 'POST',
    body: params,
  });
}

export async function ensure(params) {
  return request('/itunes/order/create', {
    method: 'POST',
    body: params,
  });
}

//创建出售
export async function getBuyDetail(params) {
  return request(`/itunes/card/buy/get_order_info?${stringify(params)}`);
}

//礼品卡列表actions结束

export async function getCaptcha(params) {
  return request(`/itunes/user/captcha?${stringify(params)}`);
}
