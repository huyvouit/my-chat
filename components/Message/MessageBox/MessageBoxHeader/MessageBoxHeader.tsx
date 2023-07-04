import { useAppDispatch, useAppSelector } from 'redux/hooks';
import React, { useCallback, useEffect } from "react";
import { MdOutlineArrowBack, MdOutlineSearch } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import MessageBoxSearch from './MessageBoxSearch/MessageBoxSearch';
import styles from "./MessageBoxHeader.module.scss";
import { useState, useMemo } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';
import LineThreeDots from 'components/common/LineThreeDots/LineThreeDots';
import { ERoomType } from 'utils/contants';
import { messageActions } from 'redux/slices/apiSlices/messageSlice';
import useResizeScreen from 'hooks/useResizeScreen';
import { useRouter } from 'next/router';
import { roomActions } from 'redux/slices/apiSlices/roomSlice';
import { Tooltip } from 'antd';
import MessageBoxListSearch from '../MessageBoxSearchList/MessageBoxSearchList';

const MessageBoxHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    user: { userInfo },
    room: {
      activeChatRoomData,
      isShowChatRoomInfo
    },
    message: { messageSearchByKeywordList: { data } },
  } = useAppSelector((state) => state);

  const { isMobile } = useResizeScreen();
  const { roomId } = router.query;

  const [openSearch, setOpenSearch] = useState<boolean>(false);

  const handleBack = () => {
    if (!!router.query.roomId) {
      if (data) {
        dispatch(messageActions.setClearDataMessageSearchList());
        setOpenSearch(false);
      }
      router.push({
        pathname: `/message`
      }, undefined, { shallow: true });
    } else {
      router.back();
    }
  };

  const handleClickSearchBtn = () => {
    setOpenSearch(true);
  };

  const roomName = useMemo(() => {
    if (activeChatRoomData?.type === ERoomType.Private) {
      const recipient = activeChatRoomData.users.find((user) => user.id !== userInfo.id);
      return recipient.name;
    }
    return activeChatRoomData?.name;
  }, [activeChatRoomData, userInfo]);

  const handleCloseSearch = useCallback(() => {
    dispatch(messageActions.setClearDataMessageSearchList())
    dispatch(messageActions.setKeywordSearchInRoom(undefined))
    setOpenSearch(false)
  }, [roomId]);

  useEffect(() => {
    handleCloseSearch();
  }, [roomId])

  return (
    <div className={`${styles[`message-box-header`]}`}>
      <div className={`${styles[`message-box-header__container`]}`}>
        {isMobile && (
          <div
            className={`${styles[`message-box-header__back`]}`}
            onClick={handleBack}
          >
            <MdOutlineArrowBack size={24} />
          </div>
        )}
        <div className={`${styles[`message-box-header__info`]}`}>
          <div className={`${styles[`message-box-header__info-group`]}`}>
            <div className={`${styles[`message-box-header__info-group-avt`]}`}></div>
            <div className={`${styles[`message-box-header__info-group-title`]}`}>
              <LineThreeDots className={`${styles[`message-box-header__info-group-title-text`]}`}>
                {roomName}
              </LineThreeDots>
              <div className={`${styles[`message-box-header__info-group-title--editable`]}`}>
                <AiTwotoneEdit /></div>
            </div>
          </div>
        </div>
        <div className={`${styles[`message-box-header__actions`]}`}>
          <div className={`${styles[`message-box-header__actions-group`]}`}>
            <div className={`${styles[`message-box-header__actions-group-search`]}`}
              onClick={handleClickSearchBtn}
            >
              <MdOutlineSearch size={22} />
            </div>
            <Tooltip title="Chat room info" placement='bottomRight'>
              <div className={`${styles[`message-box-header__actions-group-option`]}`}
                onClick={() => dispatch(roomActions.setShowChatRoomInfo(!isShowChatRoomInfo))}
              >
                <SlOptionsVertical size={18} />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {openSearch &&
        <MessageBoxSearch actionClose={handleCloseSearch}
          roomId={activeChatRoomData.id} />}

      {isMobile && openSearch && data.length > 0 && <MessageBoxListSearch /> }
    </div>

  )
}

export default MessageBoxHeader;
