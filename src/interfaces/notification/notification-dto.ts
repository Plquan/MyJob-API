import { NotificationType } from "@/entities/notification";

export interface INotificationDto {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: any;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetNotificationsRequest {
  page: number;
  limit: number;
  isRead?: boolean;
}

export interface IMarkAsReadRequest {
  notificationIds: number[];
}

export interface ICreateNotificationRequest {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: any;
}

