import { createTheme, responsiveFontSizes } from "@mui/material";

export let theme = createTheme({
  palette: {
    // mode: 'dark',
  },
});
theme = responsiveFontSizes(theme);

export enum ButtonType {
  Submit = 'submit',
  Button = 'button',
}

export enum InputType {
  Text = 'text',
  Password = 'password',
  Date = 'date',
  Number = 'number',
  Hidden = 'hidden',
}

export enum SnackbarStyles {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export enum ButtonStyle {
  Primary = 'primary',
  Secondary = 'secondary',
  Info = 'info',
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning',
  Light = 'light',
  Dark = 'dark',
  White = 'white',
  OutlinePrimary = 'outline-primary',
  OutlineSecondary = 'outline-secondary',
  OutlineInfo = 'outline-info',
  OutlineSuccess = 'outline-success',
  OutlineWarning = 'outline-warning',
  OutlineDanger = 'outline-danger',
  OutlineLight = 'outline-light',
  OutlineDark = 'outline-dark',
  DashedPrimary = 'dashed-primary',
}

export enum ButtonTextAlign {
  Middle = 'middle',
  Left = 'left',
  Right = 'right',
}

export enum ButtonSize {
  Normal = 'normal',
  Small = 'small',
}

export enum BreakPoints {
  $ssm = 320,
  $sm = 576,
  $md = 768,
  $lg = 992,
  $xl = 1200,
  $xxl = 1400,
}

export enum Color {
  Primary = "#1aa94c",
  PrimaryLight = "#aa97f7",
  Dark = "#424040",
  Danger = "#c44e3f",
  Success = "#a6dfca"
}

export enum DropdownPosition {
  Left = 'left',
  Right = 'right',
}

export enum BackgroundStyle {
  Primary = 'primary',
}

export enum CheckBoxStyle {
  Primary = 'primary',
  Secondary = 'secondary',
  Danger = 'danger',
  Warning = 'warning',
}

export enum CheckBoxType {
  Square = 'square',
  Circle = 'circle',
}

export enum FormItemStyle {
  Normal = "normal",
  Mini = "mini",
}