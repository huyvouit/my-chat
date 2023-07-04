import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { RootState } from 'redux/reducer';
import { Form, notification } from 'antd';
import MyInput from 'components/common/MyInput/MyInput';
import MyButton from 'components/common/MyButton/MyButton';

import { EResponseResult, EValidator } from 'utils/contants';
import { IResLogin } from 'services/types/user';
import styles from './SignUpForm.module.scss';
import MyInputPassword from 'components/common/MyInputPassword/MyInputPassword';
import { doRegister } from 'redux/asyncThunk/userAction';
import { IResponse } from 'services/types/common';
import { Validator } from 'utils/validator';
import { useState } from 'react';

type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

interface ISignUpForm {
  className?: string;
}

const SignUpForm: React.FC<ISignUpForm> = ({
  className,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (data: SignUpForm) => {
    setLoading(true);

    dispatch(doRegister({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    })).then(unwrapResult)
      .then((res: IResponse) => {
        if (res.result === EResponseResult.SUCCESS) {
          setLoading(false);
          // notification.success({ message: ``, description: res.message });
          router.replace("/login");
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  return (
    <div className={`${styles[`signup-form`]} ${className}`}>
      <div className={`${styles[`signup-form__container`]} ${className}`}>
        <div className={`${styles[`signup-form__header`]}`}>
          <h2>Đăng ký</h2>
        </div>
        <Form
          layout="vertical"
          size="large"
          form={form}
          scrollToFirstError
          name="signup-form"
          onFinish={onSubmit}
          className={`${styles[`signup-form__form`]}`}
        >
          <input type="hidden" id="isRunCheckPass" value="0"></input>
          <Form.Item
            name="firstName"
            className={`${styles[`signup-form__form-item`]}`}
            rules={[
              { required: true, message: "This field is required" },
              {
                pattern: new RegExp(/.*[^\s].*/),
                message: "This field is required",
              },
            ]}
          >
            <MyInput
              id={"text"}
              placeholder="First Name"
            />
          </Form.Item>
          <Form.Item
            name="lastName"
            className={`${styles[`signup-form__form-item`]}`}
            rules={[
              { required: true, message: "This field is required" },
              {
                pattern: new RegExp(/.*[^\s].*/),
                message: "This field is required",
              },
            ]}
          >
            <MyInput
              id={"text"}
              placeholder="Last Name"
            />
          </Form.Item>
          <Form.Item
            name="email"
            className={`${styles[`signup-form__form-item`]}`}
            rules={[
              { type: "email", message: "Email is not a valid" },
              { required: true, message: "This field is required" },
              {
                pattern: new RegExp(/.*[^\s].*/),
                message: "This field is required",
              },
            ]}
          >
            <MyInput
              id="email"
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            className={`${styles[`signup-form__form-item`]}`}
            rules={[
              { required: true, message: "This field is required" },
              {
                pattern: new RegExp(/.*[^\s].*/),
                message: "This field is required",
              },
              {
                min: 6,
                max: 30,
                message: "Password number between 6 to 30 characters",
              }
            ]}
          >
            <MyInputPassword placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <MyButton
              block
              loading={loading}
              type="primary"
              htmlType="submit"
              className="header-wrapper-signup"
              form="signup-form"
            >
              Đăng ký
            </MyButton>
          </Form.Item>
        </Form>
        <div className={`${styles[`signup-form__question`]}`}>
          <label>Bạn đã có tài khoản?</label>
          <Link href={`/login`}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;