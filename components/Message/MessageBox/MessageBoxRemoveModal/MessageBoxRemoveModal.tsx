import MySpinner from "components/common/MySpinner/MySpinner";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./MessageBoxRemoveModal.module.scss";

import { useAppDispatch, useAppSelector } from "redux/hooks";
import { Modal, Radio, RadioChangeEvent, Switch } from "antd";
import MyButton from "components/common/MyButton/MyButton";
import { IMessageModel } from "services/types/message";
import { messageActions } from "redux/slices/apiSlices/messageSlice";
import { doRemoveMessageByOwner, doRemoveMessageForAll } from "redux/asyncThunk/messageAction";
import { unwrapResult } from "@reduxjs/toolkit";

interface Props {
  className?: string;
  open: boolean;
  actionCancel?: () => void;
  actionRemove?: () => void;
  message: IMessageModel;
}

const MessageBoxRemoveModal: React.FC<Props> = ({
  className,
  open,
  actionCancel,
  actionRemove,
  message
}) => {
  const dispatch = useAppDispatch();
  const {
    message: {
      messageByRoomList: {
        loading
      }
    },
  } = useAppSelector((state) => state);

  const [optionRemove, setOptionRemove] = useState<number>(1);

  const handleChangeOption = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setOptionRemove(e.target.value);
  }

  const handleActionRemove = async () => {
    switch (optionRemove) {
      case 1:
        {
          dispatch(messageActions.setDeleteTempMessage(message));
          await dispatch(doRemoveMessageByOwner({
            id: message.id
          }))
            .then(unwrapResult)
            .then((res) => {
              if (res) {
                actionCancel()
              }
            })
        };
        break;
      case 2: {
        console.log("all")
        dispatch(messageActions.setDeteleTempMessageForAll(message));
        await dispatch(doRemoveMessageForAll({
          id: message.id
        }))
          .then(unwrapResult)
          .then((res) => {
            if (res) {
              actionCancel()
            }
          })
        break;
      };
      default:
        {
          dispatch(messageActions.setDeleteTempMessage(message));
          await dispatch(doRemoveMessageByOwner({
            id: message.id
          }))
            .then(unwrapResult)
            .then((res) => {
              if (res) {
                actionCancel()
              }
            })
        };
        break;
    }
  }

  return (
    <Modal
      title="Who do you want to remove this message for?"
      centered
      open={open}
      onCancel={actionCancel}
      footer={
        <div className={`${styles[`message-box-remove__footer`]}`}>
          <MyButton className={`${styles[`message-box-remove__button`]}`}
            maxWidth
            onClick={actionCancel}
          >Cancel
          </MyButton>
          <MyButton
            className={`${styles[`message-box-remove__button`]} ${styles[`message-box-remove__button--primary`]}`}
            maxWidth
            type="primary"
            onClick={handleActionRemove}
          >
            Remove
          </MyButton>
        </div>
      }

    >
      <div className={`${styles[`message-box-remove`]}`}>
        <div className={`${styles[`message-box-remove__container`]}`}>
          <Radio.Group
            onChange={handleChangeOption}
            value={optionRemove}
            defaultValue={optionRemove}
          >
            <div className={`${styles[`message-box-remove__option`]}`}>
              <Radio value={1}>
                <div>
                  <span className={`${styles[`message-box-remove__option-text`]}`}>{"Remove for you"}</span>
                  <span className={`${styles[`message-box-remove__option-text--sub`]}`}>{`This message will be removed for you. Others in the chat will still be able to see it.`}</span>
                </div>
              </Radio>
            </div>
            <div className={`${styles[`message-box-remove__option`]}`}>
              <Radio value={2}>
                <div>
                  <span className={`${styles[`message-box-remove__option-text`]}`}>{"Unsend for everyone"}</span>
                  <span className={`${styles[`message-box-remove__option-text--sub`]}`}>{`This message will be unsent for everyone in the chat. Others may have already seen or forwarded it. Unsent messages can still be included in reports.`}</span>
                </div>
              </Radio>
            </div>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  );
};

export default MessageBoxRemoveModal;
