
import MyButton from 'components/common/MyButton/MyButton';
import MyTextArea from 'components/common/MyTextArea/MyTextArea';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MessageStatus, MessageType, TextAreaType } from 'utils/contants';
import styles from "./MessageBoxInput.module.scss";
import { AiFillLike } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import MessageBoxReplied from './MessageBoxReplied/MessageBoxReplied';
import { Form } from 'antd';
import { doCreateNewMessage } from 'redux/asyncThunk/messageAction';
import { IMessageModel, IParamsCreateNewMessage } from 'services/types/message';
import MessageBoxEmoji from './MessageBoxEmoji/MessageBoxEmoji';
import MessageBoxMedia from './MessageBoxMedia/MessageBoxMedia';
import { unwrapResult } from '@reduxjs/toolkit';
import { messageActions } from 'redux/slices/apiSlices/messageSlice';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';
import { IFileStoreModel } from 'services/types/file-store';
import { IUploadFileModel } from 'services/types/common';
import MessageBoxFileStore from './MessageBoxFileStore/MessageBoxFileStore';
import { Color } from 'utils/styled-constants';

const MessageBoxInput = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const inputRef = useRef<any>();
  const dispatch = useAppDispatch();

  const { roomId } = router.query;

  const {
    message: { repliedMessageSelected },
    room: { activeChatRoomData },
    user: { userInfo },
  } = useAppSelector((state) => state);

  const [enableChat, setEnableChat] = useState<boolean>(true);
  const [defaultFileList, setDefaultFileList] = useState<IUploadFileModel<IFileStoreModel>[]>([]);
  const [submitFiles, setSubmitFiles] = useState<boolean>(true);

  const isHaveRepliedMessage = useMemo(() => {
    return Object.keys(repliedMessageSelected).length > 0;
  }, [repliedMessageSelected]);

  const validChatContent = useCallback(() => {
    const message = form.getFieldValue("message");
    if (!!message || defaultFileList.length > 0) {
      setEnableChat(false);
    } else {
      setEnableChat(true);
    }
  }, [defaultFileList]);

  //function get icon like
  async function getIconLike(value: any) {
    const emojis = await SearchIndex.search(value)
    const results = emojis.map((emoji) => {
      return emoji.skins[0].native
    })

    return results;
  }

  const scrollToLatestMessList = () => {
    setTimeout(() => {
      const messageList = document.getElementById("message-list");
      if (messageList) {
        messageList.scroll({ top: messageList.scrollHeight, behavior: "smooth" });
      }
    }, 500);
  }
  //function check input
  const handleFormValueChange = () => {
    validChatContent();
  }


  //function handle when user enter input
  const handleSubmitEnter = (e: any) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      !!defaultFileList?.length ? handleSubmit(defaultFileList) : handleSubmit()
    }
  }

  const handleEndProcessCreateMessage = () => {
    if (Object.keys(repliedMessageSelected).length > 0) {
      dispatch(messageActions.setRepliedMessage({} as IMessageModel));
    }
    scrollToLatestMessList()
    // form.resetFields();
    // setEnableChat(true);
    // setTimeout(() => {
    //   inputRef?.current?.focus();
    // }, 200);
  }

  const handleClearForm = (data?: any) => {
    if (data && data.length > 0) {
      return;
    }
    form.resetFields();
    setEnableChat(true);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 0);
  }
  // function send message
  const handleSubmit = async (currentFiles?: IUploadFileModel<IFileStoreModel>[]) => {
    const uuid = uuidv4();
    const messageText = form.getFieldValue("message");
    const filesList = currentFiles && currentFiles.length ? currentFiles : [];
    if (filesList.length || (messageText?.length > 0 && !messageText.startsWith("\n"))) {
      const messFile = filesList[0]?.response.id;
      const messType = filesList.length ? filesList[0].response?.mimetype?.includes("image") ? MessageType.Image : MessageType.File : MessageType.Text;

      const messageTemp: IMessageModel = {
        uuid,
        text: filesList?.length > 0 ? undefined : messageText,
        fileId: messFile || undefined,
        type: messType,
        file: filesList[0]?.response || undefined,
        room: activeChatRoomData.id || roomId.toString(),
        createdAt: new Date(),
        createdBy: userInfo,
        repliedMessage: isHaveRepliedMessage ? repliedMessageSelected : undefined,
        repliedMessageId: isHaveRepliedMessage ? repliedMessageSelected.id : undefined,
        pending: true,
      }
      setSubmitFiles(true)
      dispatch(messageActions.setTempMessage(messageTemp));
      handleClearForm(filesList)
      //send message to 
      const response = await dispatch(doCreateNewMessage(messageTemp));
      if (response && filesList.length > 0) {
        setDefaultFileList(prev => {
          const itemRemove = prev.length > 0 ? prev.splice(0, 1) : [];
          const data = prev.filter(item => item.response.id !== itemRemove[0].response?.id);
          if (!data.length) {
            if (messageText) {
              handleSubmit(undefined)
            }
            handleClearForm();
          } else {
            handleSubmit(data);
          }
          return data;
        });
      } else {
        handleEndProcessCreateMessage();
      }
    }
  }

  const handleSubmitButtonLike = async () => {
    let icon_like = '';
    if (enableChat) {
      icon_like = await getIconLike("thumb up");
    }
    const uuid = uuidv4();
    const messageTemp: IMessageModel = {
      uuid,
      text: icon_like[0],
      type: MessageType.Text,
      room: activeChatRoomData.id || roomId.toString(),
      createdAt: new Date(),
      createdBy: userInfo,
      repliedMessage: isHaveRepliedMessage ? repliedMessageSelected : undefined,
      repliedMessageId: isHaveRepliedMessage ? repliedMessageSelected.id : undefined,
      pending: true,
    }

    dispatch(messageActions.setTempMessage(messageTemp));

    await dispatch(doCreateNewMessage(messageTemp))
      .then(unwrapResult)
      .then(() => handleEndProcessCreateMessage());
  }

  const handleRemoveFile = (uid: string) => {
    setDefaultFileList((prev: IUploadFileModel<IFileStoreModel>[]) => {
      return prev.filter(a => a.uid !== uid);
    })
  }
  //init data cho picker emoji 
  useEffect(() => {
    init({ data });
    form.setFieldValue("message", "");
  }, [])

  useEffect(() => {
    if (defaultFileList.length > 0) {
      validChatContent();
      inputRef.current.focus();
    } else {
      setEnableChat(true);
      setSubmitFiles(true)
    }
  }, [defaultFileList]);

  useEffect(() => {
    if (isHaveRepliedMessage) {
      inputRef.current.focus();
    }
  }, [isHaveRepliedMessage])

  return (
    <Form
      form={form}
      className={`${styles[`message-box-input`]}`}
      onFinish={!!defaultFileList?.length ? () => handleSubmit(defaultFileList) : () => handleSubmit()}
      onValuesChange={handleFormValueChange}
    >
      <div className={`${styles[`message-box-input__container`]} ${isHaveRepliedMessage && styles[`message-box-input__container--border`]}`
      }>
        {isHaveRepliedMessage && (
          <MessageBoxReplied />
        )}
        <div className={`${styles[`message-box-input__input`]}`}>
          <div className={`${styles[`message-box-input__input-box`]}`}>
            {!submitFiles && (
              <MessageBoxFileStore
                files={defaultFileList}
                onRemove={handleRemoveFile}
                defaultFileList={defaultFileList}
                setDefaultFileList={setDefaultFileList}
              />
            )}
            <div
              className={`${styles[`message-box-input__input-group`]}`}
            >
              <Form.Item name="message" noStyle>
                <MyTextArea
                  ref={inputRef}
                  myType={TextAreaType.Border}
                  bordered={false}
                  placeholder="Message"
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  rows={1}
                  className={`${styles[`message-box-input__text-input`]}`}
                  onKeyDown={handleSubmitEnter}
                />
              </Form.Item>
              <MessageBoxEmoji form={form} action={validChatContent} />
              <MessageBoxMedia form={form} defaultFileList={defaultFileList} setDefaultFileList={setDefaultFileList} setSubmitFiles={setSubmitFiles} />

              <div className={`${styles[`message-box-input__media-input`]}`}>
                <div className={`${styles[`message-box-input__send-btn`]}`}>
                  <MyButton
                    className={`${styles[`message-box-input__send-btn-button`]}`}
                    // disabled={enableChat || loadingChatOverBox}
                    type="primary"
                    key="submit"
                    htmlType="submit"
                    icon={enableChat
                      ? <AiFillLike color={Color.Primary} size={26} onClick={handleSubmitButtonLike}></AiFillLike>
                      : <IoIosSend color={Color.Primary} size={28} />}
                    style={{ backgroundColor: "transparent" }}
                  ></MyButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}

export default MessageBoxInput;

