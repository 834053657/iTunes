import React from 'react';
import { Modal, Input, Button, Icon, Upload, message } from 'antd';

function OnlyPicture(props) {
  const { item, styles, index } = props;

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
          {
            // item.items.map((card, i) => {
            //   return (
            //     <div className={styles.iptBox}>
            //       <div className={styles.input}>
            //         <Input
            //           type="text"
            //           onChange={(e) => {
            //             this.denoIptValueChange(e, i, index)
            //           }}
            //         />
            //       </div>
            //       <div className={styles.icon}>
            //         <Icon
            //           type="delete"
            //         />
            //       </div>
            //     </div>
            //   )
            // })
          }
          <div>
            <div className={styles.imgBox}>
              <img
                width="85%"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                alt=""
              />
              <Icon className={styles.iconDel} type="minus-circle-o" />
            </div>
            <div className={styles.imgBox}>
              <img
                width="85%"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                alt=""
              />
              <Icon className={styles.iconDel} type="minus-circle-o" />
            </div>
            <div className={styles.imgBox}>
              <img
                width="85%"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                alt=""
              />
              <Icon className={styles.iconDel} type="minus-circle-o" />
            </div>
          </div>
          <div className={styles.addBtn}>
            <Upload className={styles.uploadBtn} {...uploadProp}>
              <Button className={styles.uploadButton}>
                <Icon type="upload" /> Click to Upload
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
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OnlyPicture;
