import { ThemeProvider } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { theme } from "utils/styled-constants";
import { RootState } from "../../../redux/reducer";
import AuthLayout from "./AuthLayout/AuthLayout";
import UnAuthLayout from "./UnAuthLayout/UnAuthLayout";

interface ILayout {
  Component: any,
  pageProps: any,
}

const Layout: React.FC<ILayout> = ({
  Component,
  pageProps
}) => {

  const {
    auth: { mainToken },
  } = useSelector((state: RootState) => state);

  return (
    <ThemeProvider theme={theme}>
      {!!mainToken ? (
        <AuthLayout Component={Component} pageProps={pageProps}></AuthLayout>
      ) : (
        <UnAuthLayout Component={Component} pageProps={pageProps}></UnAuthLayout>
      )}
    </ThemeProvider>
  )
}

export default Layout;