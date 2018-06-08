import React, { Component } from 'react';
import DescriptionList from 'components/DescriptionList';
import styles from './VideoAuthForm.less';

const { Description } = DescriptionList;

export default class VideoAuthForm extends Component {
  static defaultProps = {};
  static propTypes = {};
  state = {};

  render() {
    return (
      <div className={styles.main}>
        <DescriptionList
          className={styles.headerList}
          title="请主动联系客服,进行视频认证"
          size="large"
          col="1"
        >
          <Description term="客服电话1">321321321</Description>
          <Description term="客服电话2">321321321</Description>
          <Description term="客服电话3">321321321</Description>
          <Description term="客服QQ1">312321312321</Description>
        </DescriptionList>
      </div>
    );
  }
}
