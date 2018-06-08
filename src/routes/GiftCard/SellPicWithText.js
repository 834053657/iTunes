import React, { Component } from 'react';

import { Modal, Input, Button, Icon, Upload, message } from 'antd';
import SellUpload from './SellUpload';
import styles from './picWithText.less';

export default class PicWithText extends Component {
  state = {};

  render() {
    const { item, index, changeFileData, addCDKBox, delCDKBox, changePTPass } = this.props;
    const { ptFileList } = this.state;

    const uploadProp = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
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

    const state = {
      previewVisible: false,
      previewImage: '',
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className={styles.denomination}>
        <header>
          <span>{item.money}</span>
          面额 （{item.items.length}）
        </header>
        <section className={styles.onlyPic}>
          <div className={styles.left}>
            <ul>
              {console.log(item)}
              {item.items && item.items.length
                ? item.items.map((d, i) => {
                    return (
                      <li key={i}>
                        <div className={styles.cardTop}>
                          <span className={styles.title}>卡密：</span>
                          <div className={styles.input}>
                            <Input
                              value={d.password}
                              onChange={e => changePTPass(e, i, index)}
                              type="text"
                            />
                          </div>
                          <Icon
                            className={styles.iconDel}
                            type="minus-circle-o"
                            onClick={() => {
                              delCDKBox(item.money, i);
                            }}
                          />
                        </div>
                        <div className={styles.cardBottom}>
                          <span className={styles.title}>卡图：</span>
                          <SellUpload changeFileData={changeFileData} />
                        </div>
                      </li>
                    );
                  })
                : null}
            </ul>
            <div className={styles.addBtn}>
              <Button
                onClick={() => {
                  addCDKBox(item.money);
                }}
                className={styles.uploadButton}
              >
                添加
              </Button>
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
                    <Icon type="upload" /> 上传
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
