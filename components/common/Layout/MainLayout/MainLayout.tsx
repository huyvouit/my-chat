import { Col, Row } from "antd";
import React, { CSSProperties } from "react";
import styles from "./MainLayout.module.scss";
import useResizeScreen from "hooks/useResizeScreen";
import { useAppSelector } from "redux/hooks";
import ChatRoomInfoModal from "components/ChatRoomInfo/ChatRoomInfoModal/ChatRoomInfoModal";
import { BreakPoints } from "utils/styled-constants";

interface Props {
  listRoom?: React.ReactChildren | React.ReactNode;
  children?: React.ReactChildren | React.ReactNode;
  option?: React.ReactChildren | React.ReactNode;
  style?: CSSProperties;
  className?: string;
}

const MainLayout = React.memo<Props>(({
  children,
  listRoom,
  option,
  style,
  className,
}) => {
  const { isMobile, width } = useResizeScreen();
  const {
    room: { isShowChatRoomInfo }
  } = useAppSelector((state) => state);

  return (
    <div style={style}
      className={`${styles[`main-layout`]} ${className}`}
    >
      <Row gutter={[16, 16]} className={`${styles[`main-layout__content`]}`}>
        <Col sm={{ span: 24 }} md={{ span: 8 }} lg={{ span: 5 }} className={`${styles[`main-layout__content-list`]}`}>
          {listRoom}
        </Col>
        <Col xs={{ span: 0 }} sm={{ span: 24 }} md={{ span: 16 }} lg={{ span: isShowChatRoomInfo ? 13 : 19 }} className={`${styles[`main-layout__content-chat`]}`}>
          {!isMobile && children}
        </Col>
        <Col sm={{ span: 0 }} md={{ span: 0 }} lg={{ span: isShowChatRoomInfo ? 6 : 0 }} className={`${styles[`main-layout__content-option`]}`}>
          {!isMobile && isShowChatRoomInfo && option}
        </Col>

        {width <= BreakPoints.$lg && isShowChatRoomInfo && (
          <ChatRoomInfoModal />
        )}
      </Row>
    </div>
  );
});

export default MainLayout;
