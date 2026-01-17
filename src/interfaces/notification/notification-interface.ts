import { IPaginationResponse } from "../base/IPaginationBase";
import { ICreateNotificationRequest, IGetNotificationsRequest, IMarkAsReadRequest, INotificationDto } from "./notification-dto";

export default interface INotificationService {
  getNotifications(request: IGetNotificationsRequest): Promise<IPaginationResponse<INotificationDto>>;
  markAsRead(request: IMarkAsReadRequest): Promise<boolean>;
  markAllAsRead(): Promise<boolean>;
  getUnreadCount(): Promise<number>;
  createNotification(request: ICreateNotificationRequest): Promise<INotificationDto>;
  deleteNotification(notificationId: number): Promise<boolean>;
}

