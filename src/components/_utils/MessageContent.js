import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage as FM, defineMessages, intlShape } from 'react-intl';
import {getLocale} from '../../utils/authority';

const msg = defineMessages({
  realNameAuth: {
    id: 'message.realNameAuth',
    defaultMessage: '实名认证'
  },
  videoAuth: {
    id: 'message.videoAuth',
    defaultMessage: '视频认证'
  },
  bankAccount: {
    id: 'message.bankAccount',
    defaultMessage: '银行账号'
  },
  alipayAccount: {
    id: 'message.alipayAccount',
    defaultMessage: '支付宝账号'
  },
  giftCard: {
    id: 'message.giftCard',
    defaultMessage: '礼品卡'
  }
});

export default class MessageContent extends Component {

  static propTypes = {
    data: PropTypes.any.isRequired,
    // intl: intlShape.isRequired,
  };

  getMessageContent= (msgObj)=> {
    //get language
    // const { intl } = this.props;
    const lang = getLocale().replace('-', '_') ||  'zh_CN';
    let msgText = CONFIG[`message_type_${lang}`][msgObj.msg_type];

    if (msgObj.msg_type === 1) {
      return msgObj.title;
    } else {
      msgText = CONFIG[`message_type_${lang}`][msgObj.msg_type];
      if ([11, 12].indexOf(msgObj.msg_type) >= 0) {
        msgText = msgText.replace(
          '{auth_type}',
          msgObj.content && msgObj.content.auth_type === 1 ? INTL(msg.realNameAuth) : INTL(msg.videoAuth)
        );
      }

      if ([21, 22].indexOf(msgObj.msg_type) >= 0) {
        msgText = msgText.replace(
          '{payment_method}',
          msgObj.content && msgObj.content.payment_method === 'bank' ? INTL(msg.bankAccount) : INTL(msg.alipayAccount)
        );
        msgText = msgText.replace(
          '{account}',
          msgObj.content && msgObj.content.account ? `${msgObj.content.account.substr(0, 3)}...` : ''
        );
      }

      if ([41, 42].indexOf(msgObj.msg_type) >= 0) {
        msgText = msgText.replace('{title}', msgObj.title);
      }

      if ([51, 61, 134].indexOf(msgObj.msg_type) >= 0) {
        msgText = msgText.replace('{service_phone}', CONFIG.service_phone);
      }

      if ([52, 62].indexOf(msgObj.msg_type) >= 0) {
        msgText = msgText.replace('{service_platform}', CONFIG.service_platform);
      }

      if ([101, 102, 106, 107, 111, 114].indexOf(msgObj.msg_type) >= 0) {
        msgText = msgText.replace('{dealer}', (msgObj.sender && msgObj.sender.nickname) || '');
      }

      if ([105, 109, 110, 111, 112, 113].indexOf(msgObj.msg_type) >= 0) {
        // msgText = msgText.replace('{order_no}', msgObj.content && msgObj.content.order_no ? `${msgObj.content.order_no.substr(0, 3)}...` : '');
        msgText = msgText.replace('{order_no}', (msgObj.content && msgObj.content.order_no) || '');
      }

      if ([101, 102].indexOf(msgObj.msg_type) >= 0) {
        msgText = msgText.replace(
          '{goods_type}',
          msgObj.content && msgObj.content.goods_type === 1 ? 'Itunes' : INTL(msg.giftCard)
        );
      }

      return msgText;
    }
  }

  render() {
    const { data } = this.props;

    return <span>{this.getMessageContent(data)}</span>
  }
}
