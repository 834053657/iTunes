import { stringify } from 'qs';
import request from '../utils/request';

export async function push_system_message(params) {
  return request(`/itunes/socket/push_system_message?${stringify(params)}`);
}
