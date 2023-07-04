import { FormInstance, Popover } from "antd";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import React from "react";
import { MdInsertEmoticon } from "react-icons/md";
import styles from './MessageBoxEmoji.module.scss';

interface Props {
  form: FormInstance<any>;
  action: () => void;
}

const MessageBoxEmoji = React.forwardRef<any, Props>(({
  form,
  action
}, ref) => {

  const onClickEmoji = (value: any) => {
    form.setFieldsValue({ message: `${form.getFieldValue("message")}${value?.native}` });
    action && action();
  }

  return (
    <div className={`${styles[`message-box-emoji`]}`}>
      <div className={`${styles[`message-box-emoji__container`]}`}>
        <Popover placement="topLeft"
          content={<Picker
            data={data}
            onEmojiSelect={onClickEmoji}
            searchPosition={"static"}
            theme="light"
            emojiSize={20}
            previewPosition={"none"}
          />}
          trigger="click"
        >
          <div className={`${styles[`message-box-emoji__container-item`]}`}>
            <MdInsertEmoticon size={20} />
          </div>
        </Popover>
      </div>
    </div>
  );
});

export default MessageBoxEmoji;