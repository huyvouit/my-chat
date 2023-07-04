import moment, { Moment } from "moment";
import { ETokenKey } from "./contants";

export const common = {
  setToken: (value: string) => {
    window.localStorage.setItem(ETokenKey.MainToken, value);
  },
  setRefreshToken: (value: string) => {
    window.localStorage.setItem(ETokenKey.RefreshToken, value);
  },
  isAuthentication: () => {
    if (window.localStorage.getItem(ETokenKey.MainToken)) {
      return true;
    }
    return false;
  },
  getToken: () => {
    return window.localStorage.getItem(ETokenKey.MainToken);
  },
  getRefreshToken: () => {
    return window.localStorage.getItem(ETokenKey.RefreshToken);
  },
  removeToken: () => {
    window.localStorage.removeItem(ETokenKey.MainToken);
  },
  removeRefreshToken: () => {
    window.localStorage.removeItem(ETokenKey.RefreshToken);
  },
  uuidv4: () => {
    // Timestamp
    let d = new Date().getTime();
    // Time in microseconds since page-load or 0 if unsupported
    let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      let r = Math.random() * 16; // random number between 0 and 16
      if (d > 0) {
        // Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        // Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }

      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  },
  formatTimeToNowByLocale: (
    date: string | Date | Moment | undefined,
    locale: string | undefined,
    withoutSuffix?: boolean
  ) => {
    switch (locale) {
      case "en": {
        return moment(date).fromNow(withoutSuffix);
      }
      case "vi": {
        return moment(date).utcOffset('+07:00').fromNow(withoutSuffix);
      }

      default:
        return moment(date).utcOffset('+07:00').fromNow(withoutSuffix);
    }
  },
  minusDay: (after: string, before: string) => {
    return moment(new Date(after)).date() !== moment(new Date(before)).date();
  },
}