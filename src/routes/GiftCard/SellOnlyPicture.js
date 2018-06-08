import React, { PureComponent } from 'react';
import { Modal, Input, Button, Icon, Upload, message, Popover } from 'antd';

export default class OnlyPicture extends PureComponent {
  renderItem = (item, key) => {
    const { styles, getToken } = this.props;
    const imgContent = (
      <div className={styles.contentBox}>
        <img width="85%" src={item.src} alt="" />
      </div>
    );

    return (
      <div key={key} className={styles.imgBox}>
        <Popover placement="topLeft" content={imgContent} title="详情" trigger="click">
          <img width="85%" src={item.src} alt="" />
        </Popover>
        <Icon className={styles.iconDel} type="minus-circle-o" />
      </div>
    );
  };

  render() {
    const { item, styles, index, getToken } = this.props;

    const uploadProp = {
      name: 'file',
      action: 'http://upload-z2.qiniup.com',
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload(file, fileList) {
        Promise.all([getToken()]).then(res => {
          console.log(res);
        });
        return false;
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div className={styles.denomination}>
        <header>
          <span>{item.money}</span>
          面额 （{item.items.length}）
        </header>
        <section className={styles.onlyPic}>
          <div className={styles.left}>
            <span>卡图：</span>
          </div>
          <div className={styles.center}>
            <div>
              {this.renderItem(
                {
                  src:
                    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
                1
              )}
            </div>
            <div className={styles.addBtn}>
              <Upload className={styles.uploadBtn} {...uploadProp}>
                <Button className={styles.uploadButton}>
                  <Icon type="upload" />
                  Click to Upload
                </Button>
              </Upload>
            </div>
          </div>
          <div className={styles.receipt}>
            <div className={styles.left}>
              <span>收据:</span>
            </div>
            <div className={styles.right}>
              <div className={styles.imgBox}>
                <img
                  width="85%"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  alt=""
                />
                <Icon className={styles.iconDel} type="minus-circle-o" />
              </div>

              <div className={styles.addBtn}>
                <Upload {...uploadProp}>
                  <Button className={styles.uploadButton}>
                    <Icon type="upload" />
                    Click to Upload
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
