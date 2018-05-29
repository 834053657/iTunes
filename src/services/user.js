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

export async function resetPassword(params) {
  return request('/itunes/user/reset_password', {
    method: 'POST',
    body: params,
  });
}
