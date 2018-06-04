import { getSystemUrl } from './utils';

const { base_url, web_name, socket_url } = getSystemUrl(__KG_API_ENV__);

export default {
  socket_url,
  base_url,
  web_name,
  web_sub_title: 'Itunes & 礼品卡 在线交易平台',
  language: {
    zh_CN: '简体中文',
    en_GB: 'English',
  },
  payments: {
    wechat: '微信支付',
    alipay: '支付宝',
    bank: '银行卡',
    sys_transfer: '站内转账',
  },
  ad_type: {
    '1': '买入',
    '2': '出售',
  },
  ad_status: {
    '1': '已暂停',
    '2': '已发布',
    '3': '冻结',
  },
  order_status: {
    '1': '打开中',
    '2': '待查收',
    '3': '保障中',
    '4': '申述中',
    '5': '已完成',
    '6': '已取消',
  },
  googs_type: {
    '1': 'itunes',
    '2': '礼品卡',
  },
  message_type_zh_CN: {
    1: '系统资讯',
    11: '您的身份认证，后台已审核通过',
    12: '您的身份认证，后台审核未通过',
    21: '您提交的支付方式，后台认证通过',
    22: '您提交的支付方式，后台认证不通过',
    31: '提现成功',
    32: '提现失败',
    33: '充值成功',
    34: '充值失败',
    41: '交易详情审核通过',
    42: '交易详情审核不通过',
    101: '您有新的订单',
    102: '您的交易订单，已确认释放',
    103: '对方已上传凭证成功',
    104: '您有新的交易消息',
    105: '你有新的申述',
    106: '订单保障时间介绍，订单自动取消',
    107: '客服处理申述，申述结果 完成/取消订单',
  },
  message_type_en_GB: {
    1: '系统资讯',
    11: '您的身份认证，后台已审核通过',
    12: '您的身份认证，后台审核未通过',
    21: '您提交的支付方式，后台认证通过',
    22: '您提交的支付方式，后台认证不通过',
    31: '提现成功',
    32: '提现失败',
    33: '充值成功',
    34: '充值失败',
    41: '交易详情审核通过',
    42: '交易详情审核不通过',
    101: '您有新的订单',
    102: '您的交易订单，已确认释放',
    103: '对方已上传凭证成功',
    104: '您有新的交易消息',
    105: '你有新的申述',
    106: '订单保障时间介绍，订单自动取消',
    107: '客服处理申述，申述结果 完成/取消订单',
  },
};
