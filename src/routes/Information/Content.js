import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './Detail.less';

@connect(({ information, loading }) => ({
  data: information.infoDetail,
  loading: loading.models.information,
}))
export default class Content extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'information/fetchStaticContent',
      payload: { type: this.props.type },
    });
  }

  render() {
    const { data={} } = this.props;

    return (
      <div className={styles.detail}>
        <div className={styles.content}>
          <div dangerouslySetInnerHTML={{__html: data.content}} />
        </div>
      </div>
    );
  }
}
