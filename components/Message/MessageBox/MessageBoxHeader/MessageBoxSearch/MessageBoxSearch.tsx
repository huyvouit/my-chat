import styles from "./MessageBoxSearch.module.scss";
import { MdOutlineSearch } from "react-icons/md";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import MyInput from 'components/common/MyInput/MyInput';
import MyButton from 'components/common/MyButton/MyButton';
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { IMessageModel, IParamsMessageList } from "services/types/message";
import { doFindMessageInDatabase, doGetMessagePaginationListByKeyword } from "redux/asyncThunk/messageAction";
import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import { messageActions } from "redux/slices/apiSlices/messageSlice";

interface Props {
  roomId?: string;
  actionClose: () => void;
}

const MessageBoxSearch: React.FC<Props> = ({ roomId, actionClose }) => {
  const dispatch = useAppDispatch();
  const {
    room: {
      activeChatRoomData
    },
    message: {
      messageByRoomList,
      keywordSearchInRoom,
      messageSearchByKeywordList: {
        selectedMessage,
        data,
        pagination,
        loading
      }
    }
  } = useAppSelector((state) => state);

  const [listMessageSearch, setListMessageSearch] = useState<IMessageModel[]>([]);

  const searchRef = useRef<any>();
  const [currentSearch, setCurrentSearch] = useState<IMessageModel>();


  const handleSearchText = (value: string) => {
    if (!value) {
      dispatch(messageActions.setKeywordSearchInRoom(undefined));
      return;
    }
    const param: IParamsMessageList = {
      room: roomId,
      pageIndex: 1,
      text: value || undefined,
    };

    dispatch(messageActions.setKeywordSearchInRoom(value));
    dispatch(doGetMessagePaginationListByKeyword(param));

  }

  const handleSubmitSearch = (e: any) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      handleSearchText(e.target.value);
    }
  }

  const handleIncrearingIndexSearch = () => {
    if (listMessageSearch?.length > 0) {
      const index = listMessageSearch.findIndex((message) => message.id === selectedMessage.id);
      console.log(index)
      if (index !== -1) {
        setCurrentSearch(listMessageSearch[index - 1]);
        dispatch(messageActions.setSelectedMessageSearch(listMessageSearch[index - 1]))
      }
    }
  }

  const handleDecreasingIndexSearch = () => {
    if (listMessageSearch?.length > 0) {

      const index = listMessageSearch.findIndex((message) => message.id === selectedMessage.id);
      console.log(index)
      if (index !== -1) {
        setCurrentSearch(listMessageSearch[index + 1]);
        dispatch(messageActions.setSelectedMessageSearch(listMessageSearch[index + 1]))
      }
    }
  }

  //function click button increasing / decreasing search
  const handleClick = async (item: IMessageModel) => {
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
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

        const element = document.getElementById(`message-chat-${item.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.animate(zooming, timing);
        }
      }, 500);
    }
  }

  const disabledButtonScrollUp = useMemo(() => {
    return !listMessageSearch?.length || (listMessageSearch.length > 0 && listMessageSearch?.findIndex((message) => message.id === selectedMessage.id) === listMessageSearch.length - 1)
  }, [listMessageSearch, selectedMessage]);

  const disabledButtonScrollDown = useMemo(() => {
    return !listMessageSearch?.length || (listMessageSearch.length > 0 && listMessageSearch?.findIndex((message) => message.id === selectedMessage.id) === 0)
  }, [listMessageSearch, selectedMessage]);

  useEffect(() => {
    searchRef.current.focus();
  }, [])

  useEffect(() => {
    if (listMessageSearch?.length > 0) {
      if (currentSearch) {
        handleClick(currentSearch)
      }
    }
  }, [currentSearch])

  useEffect(() => {
    setListMessageSearch(data);
    setCurrentSearch(selectedMessage);
  }, [data])

  return (
    <div className={`${styles[`message-box-search`]}`}>
      <div className={`${styles[`message-box-search__container`]}`}>
        <div className={`${styles[`message-box-search__input`]}`}>
          <div className={`${styles[`message-box-search__input-group`]}`}>
            <MyInput
              prefix={<MdOutlineSearch />}
              placeholder={"Search"}
              className={`${styles[`message-box-search__input-group-item`]}`}
              suffix={loading ? <Spin size="small" /> : (data?.length >= 0 && typeof keywordSearchInRoom != "undefined" ? `${pagination.totalCount} results` : <></>)}
              ref={searchRef}
              onKeyDown={handleSubmitSearch}
            />
          </div>
        </div>

        <div className={`${styles[`message-box-search__scroll`]}`}>
          <div className={`${styles[`message-box-search__scroll-group`]}`}>
            <MyButton
              className={`${styles[`message-box-search__scroll-group-up`]}`}
              onClick={handleDecreasingIndexSearch}
              disabled={disabledButtonScrollUp}
            >
              <span><FiChevronUp size={18} /></span>
            </MyButton>
            <MyButton
              className={`${styles[`message-box-search__scroll-group-down`]}`}
              onClick={handleIncrearingIndexSearch}
              disabled={disabledButtonScrollDown}
            >
              <span><FiChevronDown size={18} /></span>
            </MyButton>
          </div>
        </div>

        <div className={`${styles[`message-box-search__button`]}`}>
          <div className={`${styles[`message-box-search__button-group`]}`}>
            <MyButton className={`${styles[`message-box-search__button-group-btn`]}`}
              onClick={actionClose}
              type="link"
            >
              Close
            </MyButton>
          </div>
        </div>
      </div>
    </div >

  )
}

export default MessageBoxSearch;
