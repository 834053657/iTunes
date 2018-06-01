import React from 'react';
import { Avatar, List, Icon } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';
import moment from 'moment';

export default function NoticeList({
  data = [],
  onClick,
  onClear,
  onView,
  title,
  locale,
  emptyText,
  emptyImage,
}) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          return (
            <List.Item className={itemCls} key={item.id || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                // avatar={item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null}
                title={
                  <div>
                    <div className={styles.title}>
                      {item.msg_type === 1 ? <Icon type="file-text" /> : <Icon type="bell" />} {item.title}
                    </div>
                    <div>
                      {item.created_at && moment(new Date(item.created_at * 1000)).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.action}>
        <div className={styles.clear} onClick={onClear}>
          清除全部
        </div>
        <div className={styles.view_more} onClick={onView}>
          查看更多
        </div>
      </div>
    </div>
  );
}
