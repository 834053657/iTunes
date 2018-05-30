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
  return request('/itunes/post_verify', {
    method: 'POST',
    body: params,
  });
}

// -------------- 注册 end --------------

export async function postVerifyCaptcha(params) {
  return request('/itunes/verify_captcha', {
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
  return request('/itunes/get_defined');
}

//礼品卡列表actions开始

export async function getGiftCard(params) {
  console.log('params');
  console.log(params);
  console.log(stringify(params));
  return request(`/itunes/get_card_list?${stringify(params)}`);
}

//礼品卡列表actions结束
