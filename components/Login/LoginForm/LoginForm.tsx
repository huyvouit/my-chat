import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { RootState } from 'redux/reducer';
import { Form } from 'antd';
import MyInput from 'components/common/MyInput/MyInput';
import MyButton from 'components/common/MyButton/MyButton';
import { doLogin } from 'redux/asyncThunk/loginAction';
import { EResponseResult } from 'utils/contants';
import { IResLogin } from 'services/types/user';
import styles from './LoginForm.module.scss';
import MyInputPassword from 'components/common/MyInputPassword/MyInputPassword';

type LoginForm = {
  email: string;
  password: string;
};

interface ILoginForm {
  className?: string;
}

const LoginForm: React.FC<ILoginForm> = ({
  className,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();

  const {
    login: { isLoading },
  } = useAppSelector((state: RootState) => state);

  const onSubmit = (data: LoginForm) => {
    dispatch(doLogin({
      email: data.email,
      password: data.password,
    })).then(unwrapResult)
      .then((res: IResLogin) => {
        if (res.result === EResponseResult.SUCCESS) {
          // router.replace("/");
          router.replace("/message");
        }
      });
  }

  return (
    <div className={`${styles[`login-form`]} ${className}`}>
      <div className={`${styles[`login-form__container`]}`}>
        <div className={`${styles[`login-form__header`]}`}>
          <h2>Đăng nhập</h2>
        </div>
        <Form
          layout="vertical"
          size="large"
          form={form}
          scrollToFirstError
          name="login-form"
          className={`${styles[`login-form__form`]}`}
          onFinish={onSubmit}>
          <input type="hidden" id="isRunCheckPass" value="0"></input>
          <Form.Item name="email" className={`${styles[`login-form__form-item`]}`}>
            <MyInput
              id="email"
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item name="password" className={`${styles[`login-form__form-item`]}`}>
            <MyInputPassword placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <MyButton
              block
              loading={isLoading}
              type="primary"
              htmlType="submit"
              className="header-wrapper-login"
              form="login-form"
            >
              Đăng nhập
            </MyButton>
          </Form.Item>
        </Form>
        <div className={`${styles[`login-form__question`]}`}>
          <label>Bạn chưa có tài khoản?</label>
          <Link href={`/sign-up`}>Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;