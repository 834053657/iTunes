import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/itunes/user/info');
}

export async function forgetPassword(params) {
  return request('/itunes/user/forget_password', {
    method: 'POST',
    body: params,
  });
}

export async function updatePassword(params) {
  return request('/itunes/user/update_password', {
    method: 'POST',
    body: params,
  });
}
