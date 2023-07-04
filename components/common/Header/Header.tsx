import { Avatar, Badge } from 'antd';
import { useRouter } from 'next/router';
import { common } from 'utils/common';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setMainToken } from '../../../redux/slices/appSlices/authSlice';
import MyButton from '../MyButton/MyButton';
import styles from './Header.module.scss';
import { BiBell } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import CreateChatRoomModal from 'components/ChatRoom/CreateChatRoomModal/CreateChatRoomModal';
import { roomActions } from 'redux/slices/apiSlices/roomSlice';
import Notification from 'components/Notification/Notification';
interface IHeader {

}

const Header: React.FC<IHeader> = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    room: { isShowCreateRoomModal }
  } = useAppSelector((state) => state);

  const logout = () => {
    common.removeToken();
    common.removeRefreshToken();
    dispatch(setMainToken(''));
    router.replace("/login");
  }

  return (
    <div className={`${styles['header']}`}>
      <div className={`${styles['header__content']}`}>
        <div className={`${styles['header__logo']}`}>
          Live Chat
        </div>
        <div className={`${styles['header__action']}`}>
          <MyButton
            className={`${styles[`header_action-add`]}`}
            onClick={() => dispatch(roomActions.setShowCreateRoomModal(true))}
          >
              + New Chat
          </MyButton>
          <div className={`${styles[`header_action-user`]}`}>
            <Avatar src={"https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/Hinh-anh-avatar-cute.jpg?ssl=1"}
              size={30}
              style={{ border: "1px solid #ccc" }}
            ></Avatar>
          </div>
          <div className={`${styles['header__action-notification']}`} >
            <Notification />
          </div>
          <div className={`${styles['header__action-logout']}`} onClick={() => logout()} >
            <FiLogOut size={26} />
          </div>
        </div>
      </div>

      {isShowCreateRoomModal && <CreateChatRoomModal />}
    </div>
  )
}

export default Header;