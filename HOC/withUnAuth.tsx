import { ConfigProvider } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useAppDispatch } from "redux/hooks";
import { socketActions } from "redux/slices/appSlices/socketSlice";
import { common } from "utils/common";
import { Color } from "utils/styled-constants";
import { setMainToken } from "../redux/slices/appSlices/authSlice";

const withUnAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // useEffect(() => {
    //   const mainToken = common.getToken();
    //   const refreshToken = common.getRefreshToken();

    //   if (mainToken && refreshToken) {
    //     setIsLoading(true);
    //     dispatch(doRefreshToken({
    //       accessToken: mainToken,
    //       refreshToken: refreshToken,
    //     })).then(unwrapResult)
    //       .then((response: IResRefreshToken) => {
    //         if (response.result === EResponseResult.SUCCESS) {
    //           router.push(`/`);
    //         } else {
    //           dispatch(setMainToken(''));
    //           common.removeToken();
    //           common.removeRefreshToken();
    //           setIsLoading(false);
    //         }
    //       })
    //       .catch(() => setIsLoading(false));
    //   }
    // }, []);

    useEffect(() => {
      const mainToken = common.getToken();
      if (mainToken) {
        dispatch(setMainToken(mainToken));
        dispatch(socketActions.connectionEstablished());
        router.push(`/`);
      }
    }, []);

    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: Color.Primary,
          },
          components: {
            Anchor: {
              colorLinkHover: Color.Primary,
            },
            Button: {
              colorPrimary: Color.Primary,
            }
          }
        }}
      >
        <WrappedComponent {...props} />
        {/* <Loading isShow={isLoading}></Loading> */}
      </ConfigProvider>
    );
  };
};

export default withUnAuth;