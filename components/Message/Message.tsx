import MainLayout from 'components/common/Layout/MainLayout/MainLayout';
import { useRouter } from 'next/router';
import ChatRoom from 'components/ChatRoom/ChatRoom';
import ChatRoomInfo from 'components/ChatRoomInfo/ChatRoomInfo';
import styles from "./Message.module.scss";
import MessageBox from './MessageBox/MessageBox';
import { useAppSelector } from 'redux/hooks';
import MessageBoxListSearch from './MessageBox/MessageBoxSearchList/MessageBoxSearchList';

interface Props {
  roomId?: string;
}

const Message: React.FC<Props> = ({ roomId }) => {
  const {
    message: { messageSearchByKeywordList: { data, pagination } },
    room: { activeChatRoomData }
  } = useAppSelector((state) => state);
  return (
    <MainLayout
      listRoom={Object.keys(data).length > 0 ? <MessageBoxListSearch /> : <ChatRoom className={`${styles[`message__room`]}`} roomId={roomId} />}
      option={<ChatRoomInfo className={`${styles[`message__room-info`]}`} />}
    >
      <div className={`${styles[`message`]}`}>
        <MessageBox />
      </div>
    </MainLayout>
  )
}

export default Message;
