import { Modal, ModalProps } from "antd";
import MyButton from "../MyButton/MyButton";
import styles from './MyModal.module.scss';

export enum FooterModalBtnType {
  Default = 'default',
  My = 'my',
}

interface Props extends ModalProps {
  footerType?: FooterModalBtnType;
  isHiddenOk?: boolean;
  textOnOk?: string;
}

const MyModal: React.FC<Props> = ({
  footerType = FooterModalBtnType.Default,
  isHiddenOk = false,
  textOnOk = 'Ok',
  ...props
}) => {

  return (
    <Modal {...props} className={`${styles[`my-modal`]} ${props.className}`}
      footer={!!props.footer ? (
        props.footer
      ) : footerType === FooterModalBtnType.My ? [
        <MyButton key="button" onClick={props.onCancel as any}>
          Cancel
        </MyButton>,
        <>
          {isHiddenOk ? <></> : (
            <MyButton key="button" type="primary" onClick={props.onOk as any}>
              {textOnOk}
            </MyButton>
          )}
        </>,
      ] : props.footer}
    ></Modal>
  );
}

export default MyModal;