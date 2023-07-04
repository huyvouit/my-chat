
import React, { useMemo, useState, useEffect } from "react";
import styles from './MessageBoxItem.module.scss';
import { RiShareForwardLine } from "react-icons/ri";
import { IMessageModel, IParamsRemoveMessage } from "services/types/message";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { messageActions } from "redux/slices/apiSlices/messageSlice";
import { SlOptionsVertical } from "react-icons/sl";
import { Dropdown, Form, MenuProps } from "antd";
import { unwrapResult } from "@reduxjs/toolkit";
import { doFindMessageInDatabase, doRemoveMessage, doUpdateMessage } from "redux/asyncThunk/messageAction";
import MyTextArea from "components/common/MyTextArea/MyTextArea";
import { MessageStatus, MessageType, TextAreaType } from "utils/contants";
import moment from "moment";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { BsFileEarmarkFill } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import LineThreeDots from "components/common/LineThreeDots/LineThreeDots";
import MessageBoxRemoveModal from "../../MessageBoxRemoveModal/MessageBoxRemoveModal";
import Link from "next/link";
import { common } from "utils/common";

type IMessageActionMenu = ItemType & {
  children?: ItemType[],
  isShowItem: string,
};
interface Props {
  className?: string;
  messageData: IMessageModel;
  isShow?: boolean;
  isShowTime?: boolean;
}

const MessageBoxItem = React.forwardRef<any, Props>(({ messageData, isShow, isShowTime, ...props }, ref) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const {
    user: { userInfo },
    room: { activeChatRoomData },
    message: { messageByRoomList }
  } = useAppSelector((state) => state);

  const [isEditabbleMessage, setIsEditableMessage] = useState<boolean>(false);
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState<boolean>(false);

  const isMine = useMemo(() => {
    return userInfo.id == messageData.createdBy?.id || userInfo.id == messageData.createdBy.id;
  }, [userInfo, messageData]);


  const handleClickViewRepliedMessage = async (item: IMessageModel) => {
    let temp = messageByRoomList.data.find(message => message.id === item.id);

    if (!temp) {
      await dispatch(doFindMessageInDatabase({
        room: activeChatRoomData.id,
        messageId: item.id,
        pageIndex: messageByRoomList.pagination.pageIndex + 1,
        response: {
          ...messageByRoomList.pagination,
          data: [],
        },
      }))
        .then(unwrapResult)
        .then(() => {
          setTimeout(() => {
            const zooming = [
              { transform: "rotate(0) scale(1.1)" },
            ];
            const timing = {
              duration: 1000,
              iterations: 1,
              delay: 200
            };

            const element = document.getElementById(`message-chat-${item.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              element.animate(zooming, timing);
            }
          }, 500);
        });
    } else {
      setTimeout(() => {
        const zooming = [
          { transform: "rotate(0) scale(1.1)" },
        ];
        const timing = {
          duration: 1000,
          iterations: 1,
          delay: 200
        };

        const element = document.getElementById(`message-chat-${temp?.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.animate(zooming, timing);
        }
      }, 500);
    }
  }

  const handleSelectRepliedMessage = (message?: IMessageModel) => {
    dispatch(messageActions.setRepliedMessage(message));
  };

  const handleSubmitUpdateMessage = (e: any) => {
    if (e.keyCode === 13 && !e.shiftKey) {

      dispatch(messageActions.setUpdateTempMessage({
        ...messageData,
        text: form.getFieldValue("message")
      }));

      dispatch(doUpdateMessage({
        id: messageData.id,
        text: form.getFieldValue("message")
      }))
        .then(unwrapResult)
        .then(() => {
          setIsEditableMessage(false)
        })

    }
    if (e.keyCode === 27 && !e.shiftKey) {
      setIsEditableMessage(false)
    }
  }

  const handleRemoveMessage = () => {
    setIsOpenRemoveModal(true)
  }

  const messageAction: IMessageActionMenu[] = useMemo(
    () => [
      {
        key: '1',
        label: (
          <div onClick={() => setIsEditableMessage(true)}>
            Edit
          </div>
        ),
        isShowItem: (messageData.type == MessageType.Text).toString(),
      },
      {
        key: '2',
        label: (
          <div>
            Remove
          </div>
        ),
        isShowItem: "true",
        onClick: handleRemoveMessage,
      }
    ], []);

  const menu: MenuProps = useMemo(
    () => ({
      items: messageAction.filter((item) => item.isShowItem === "true"),
    }),
    [messageAction, messageData]
  );
  const handleChangeMessage = () => {

  }

  const handleCancelRemoveMessage = () => {
    setIsOpenRemoveModal(false);
  }

  const checkDate = () => {
    const dateNow = new Date();
    return common.minusDay(messageData.createdAt.toString(), dateNow.toString());
  }

  const creatorName = useMemo(() => {
    if (messageData.createdBy.id === userInfo.id) {
      return "You";
    }
    return messageData.createdBy.name;
  }, [messageData, userInfo]);

  useEffect(() => {
    form.setFieldsValue({ message: messageData.text })
  }, []);

  return (
    <>
      {messageData.type === MessageType.Info ? (
        <div className={`${styles[`message-box-item--info`]}`} >
          {messageData.text.replace("{{creatorName}}", creatorName)
            .replace(userInfo.name, "you")}
        </div>
      ) : (
        <div className={`${styles[`message-box-item`]} ${!isShow ? styles[`message-box-item--small`] : ``}`} title={checkDate() ? moment(messageData.createdAt).format("DD-MM-YYYY HH:mm") : moment(messageData.createdAt).format("HH:mm")}>
          <div className={`${styles[`message-box-item__container`]} ${isMine ? styles[`message-box-item__container--mine`] : ``
            }`}>
            <div className={`${styles[`message-box-item__avatar`]} ${!isShow ? styles[`message-box-item__avatar--none`] : ``}
          `}></div>
            <div className={`${styles[`message-box-item__content`]}`}>
              {isShow &&
                <label className={`${styles[`message-box-item__name`]}`}>
                  {!isMine && (
                    <strong>{messageData.createdBy.name}</strong>
                  )}
                  {/* <small>{moment(messageData.createdAt).format("HH:mm")}</small> */}
                </label>
              }
              <div
                className={`${styles[`message-box-item__message`]}
                ${messageData?.repliedMessage ? styles[`message-box-item__message--have-replied`] : ``}`}
              >
                {messageData?.repliedMessage && (messageData.repliedMessage.status == MessageStatus.Active && messageByRoomList.data.some(item => item.id == messageData.repliedMessage.id)) ? (
                  <div className={`${styles[`message-box-item__message-replied`]}`}>
                    <div className={`${styles[`message-box-item__message-replied-wrapper`]}`} >
                      {
                        messageData?.repliedMessage?.text &&
                        <div className={`${styles[`message-box-item__message-replied-content`]}`}
                          onClick={() => handleClickViewRepliedMessage(messageData?.repliedMessage)}
                        >
                          {messageData?.repliedMessage?.text}
                        </div>
                      }
                      {
                        messageData?.repliedMessage?.file &&
                        (
                          messageData?.repliedMessage?.type == MessageType.Image ? (
                            <div
                              className={`${styles[`message-box-item__message-replied-file--img`]}`}
                              id={`message-chat-${messageData.id}`}
                              onClick={() => handleClickViewRepliedMessage(messageData?.repliedMessage)}
                            >
                              <img src={messageData?.repliedMessage?.file?.link as string} alt="" />
                            </div>
                          )
                            : (
                              <div
                                className={`${styles[`message-box-item__message-replied-file--attachment`]}`}
                                id={`message-chat-${messageData.id}`}
                                onClick={() => handleClickViewRepliedMessage(messageData?.repliedMessage)}
                              >
                                <div className={`${styles[`attachment__name`]}`}>{"Attachment"}</div>
                                <div className={`${styles[`attachment__icon`]}`}>
                                  <GrAttachment size={12} />
                                </div>
                              </div>
                            )
                        )
                      }
                      <div className={`${styles[`message-box-item__message-replied-text`]}`} >
                        {
                          messageData?.text &&
                          <div className={`${styles[`message-box-item__message-replied--sub`]}`} id={`message-chat-${messageData.id}`}>
                            {
                              isEditabbleMessage ?
                                <Form
                                  form={form}
                                  onFinish={handleSubmitUpdateMessage}
                                  onValuesChange={handleChangeMessage}
                                >
                                  <Form.Item name="message" noStyle>
                                    <MyTextArea
                                      myType={TextAreaType.NoBorder}
                                      value={messageData.text}
                                      style={{ border: "none", background: "transparent", height: "100%" }}
                                      onKeyDown={handleSubmitUpdateMessage}
                                      onChange={handleChangeMessage}
                                    />
                                  </Form.Item>
                                </Form>
                                : messageData?.text
                            }
                          </div>
                        }
                        {
                          messageData?.file &&
                          (
                            messageData?.type == MessageType.Image ? (
                              <Link href={`${messageData?.file?.link as string}`} passHref
                                target="_blank"
                                className={`${styles[`message-box-item__message-file--img`]}`}
                                id={`message-chat-${messageData.id}`}
                              >
                                <img src={messageData?.file?.link as string} alt="" />
                              </Link>
                            )
                              : (
                                <Link href={`${messageData?.file?.link as string}`} passHref
                                  target="_blank"
                                  className={`${styles[`message-box-item__message-file--attachment`]}`}
                                  id={`message-chat-${messageData.id}`}
                                >
                                  <div className={`${styles[`attachment__icon`]}`}>
                                    <BsFileEarmarkFill size={20} />
                                  </div>
                                  <div className={`${styles[`attachment__name`]}`}>
                                    <LineThreeDots className={`${styles["attachment__name-text"]}`} numberLine={2}>
                                      {messageData?.file?.name}
                                    </LineThreeDots>
                                  </div>
                                </Link>
                              )
                          )
                        }
                        <div className={`${styles["message-box-item__message-actions"]}`}
                        >
                          <div className={`${styles[`message-box-item__message-actions-forward`]}`}
                            onClick={() => handleSelectRepliedMessage(messageData)}
                            title="Reply"
                          >
                            <RiShareForwardLine size={18} />
                          </div>

                          {userInfo?.id === messageData.createdBy.id && (
                            <div className={`${styles[`message-box-item__message-actions-option`]}`}>
                              <Dropdown menu={menu} placement="top"
                                arrow={{ pointAtCenter: true }}
                                autoFocus={false}
                                trigger={['click']}
                              >
                                <SlOptionsVertical size={14} />
                              </Dropdown>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {
                      messageData.status === MessageStatus.InActive ?
                        <div className={`${styles[`message-box-item__message-content--remove`]}`} id={`message-chat-${messageData.id}`}>
                          <>{messageData?.text}</>
                        </div>
                        :
                        <>
                          {
                            messageData?.text &&
                            <div className={`${styles[`message-box-item__message-content`]}`} id={`message-chat-${messageData.id}`}>
                              {
                                isEditabbleMessage ? (
                                  <Form
                                    form={form}
                                    onFinish={handleSubmitUpdateMessage}
                                    onValuesChange={handleChangeMessage}
                                  >
                                    <Form.Item name="message" noStyle>
                                      <MyTextArea
                                        myType={TextAreaType.NoBorder}
                                        className={`${styles[`message-box-item__message-content-textarea`]}`}
                                        value={messageData.text}
                                        style={{ border: "none", background: "transparent", height: "100%" }}
                                        onKeyDown={handleSubmitUpdateMessage}
                                        onChange={handleChangeMessage}
                                      />
                                    </Form.Item>
                                  </Form>
                                ) : (
                                  <>{messageData?.text}</>
                                )
                              }
                            </div>
                          }
                          {
                            messageData?.file &&
                            (
                              messageData?.type == MessageType.Image ? (
                                <Link href={`${messageData?.file?.link as string}`} passHref
                                  target="_blank" className={`${styles[`message-box-item__message-file--img`]}`} id={`message-chat-${messageData.id}`}>
                                  <img src={messageData?.file?.link as string} alt="" />
                                </Link>
                              )
                                : (
                                  <Link href={`${messageData?.file?.link as string}`} passHref
                                    target="_blank"
                                    className={`${styles[`message-box-item__message-file--attachment`]}`}
                                    id={`message-chat-${messageData.id}`}
                                  >
                                    <div className={`${styles[`attachment__icon`]}`}>
                                      <BsFileEarmarkFill size={20} />
                                    </div>
                                    <div className={`${styles[`attachment__name`]}`}>
                                      <LineThreeDots className={`${styles["attachment__name-text"]}`} numberLine={2}>
                                        {messageData?.file?.name}
                                      </LineThreeDots>
                                    </div>
                                  </Link>
                                )
                            )
                          }
                          {

                            <div className={`${styles["message-box-item__message-actions"]}`}>
                              <div className={`${styles[`message-box-item__message-actions-forward`]}`}
                                onClick={() => handleSelectRepliedMessage(messageData)}>
                                <RiShareForwardLine size={18} />
                              </div>
                              {userInfo?.id === messageData.createdBy.id && (
                                <div className={`${styles[`message-box-item__message-actions-option`]}`}>
                                  <Dropdown menu={menu} placement="top"
                                    arrow={{ pointAtCenter: true }}
                                    autoFocus={false}
                                    trigger={['click']}
                                  >
                                    <SlOptionsVertical size={14} />
                                  </Dropdown>
                                </div>
                              )}
                            </div>
                          }
                        </>
                    }
                  </>
                )}
              </div>
              <div className={`${styles[`message-box-item__status`]}`}>
                {isShowTime && (
                  <label className={`${styles[`message-box-item__name`]}`}>
                    <small>{moment(messageData.createdAt).format("HH:mm")}</small>
                  </label>
                )}
                {messageData.pending && messageData.createdBy.id == userInfo.id && (
                  <label className={`${styles[`message-box-item__name`]}`}>
                    <small>{"Seending"}</small>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isOpenRemoveModal &&
        <MessageBoxRemoveModal
          open={isOpenRemoveModal}
          message={messageData}
          actionCancel={handleCancelRemoveMessage}
        />
      }
    </>
  );
});

export default React.memo(MessageBoxItem);