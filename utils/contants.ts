export const DATE_FORMAT = "dd-MMM-yy";

export const OneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

export enum ETokenKey {
  MainToken = "live-chat@main-token",
  RefreshToken = "live-chat@refresh-token",
}

export enum EResponseResult {
  SUCCESS = 20,
  ERROR = 90,
}

export enum EValidator {
  Required = "required",
  Min = "min",
  Max = "max",
  MaxLength = "maxLength",
  MinLength = "minLength",
  Pattern = "pattern",
  ValueAsNumber = "valueAsNumber",
  ValueAsDate = "valueAsDate",
}

export enum ESocketEvent {
  ReceiveMessage = 'receive-message',
  CreatedRoom = 'created-room',
  ViewNewMessage = 'view-new-message',
  ViewAllMessageInRoom = 'view-all-message-in-room',
  ReceiveNotification = 'receive-notification',
  UpdatedMessage = "updated-message",
  DeletedMessage = "deleted-message",
  RemoveMessageForAll = "removed-message-for-all"
}
export enum KeyElement {
  MessList = "message-list-scroll",
  ChatRoomList = "chat-room-list",
  NotificationList = "notification-list",
  MesageSearchList = "message-search-list",
  MessageSearchItem = "message-search-item"
}

export enum ERoomType {
  Private = 10,
  Contribute = 50,
}

export enum PositionSpinner {
  Middle = 'moddile',
  Top = 'top',
}

export enum TextAreaType {
  Border = 'border',
  NoBorder = 'no-border',
}

export enum MessageType {
  Text = 10,
  File = 20,
  Image = 30,
  Info = 40,
}

export enum MessageStatus {
  Active = 10,
  Pending = 50,
  InActive = 90,
  Removed = 190,
}

export enum NormalStatus {
  Active = 10,
  InActive = 90,
  Removed = 190,
}

export enum ERoomRole {
  Admin = 10,
  Manager = 50,
  User = 90,
}

export const ROOM_ROLE: { [key: number]: string } = {
  [ERoomRole.Admin]: "Admin",
  [ERoomRole.Manager]: "Manager",
  [ERoomRole.User]: "Member",
};

export enum NotificationType {
  ReceiveMessage = 10,
  CreateRoom = 20,
};

export enum NotificationStatus {
  Read = 10,
  UnRead = 50,
  Removed = 190
};

export enum MessageUserStatus {
  Active = 10,
  Removed = 190,
}