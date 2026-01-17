import { getCurrentUser } from "@/common/helpers/get-current-user";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { HttpException } from "@/errors/http-exception";
import INotificationService from "@/interfaces/notification/notification-interface";
import DatabaseService from "../common/database-service";
import { ICreateNotificationRequest, IGetNotificationsRequest, IMarkAsReadRequest, INotificationDto } from "@/interfaces/notification/notification-dto";
import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";
import SocketService from "../common/socket-service";
import { Notification } from "@/entities/notification";

export default class NotificationService implements INotificationService {
  private readonly _context: DatabaseService;

  constructor(DatabaseService: DatabaseService) {
    this._context = DatabaseService;
  }

  async getNotifications(request: IGetNotificationsRequest): Promise<IPaginationResponse<INotificationDto>> {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "User not found");
      }

      const { page, limit, isRead } = request;

      const qb = this._context.NotificationRepo
        .createQueryBuilder('notification')
        .where('notification.userId = :userId', { userId: user.id });

      if (isRead !== undefined) {
        qb.andWhere('notification.isRead = :isRead', { isRead });
      }

      const totalItems = await qb.getCount();

      const notifications = await qb
        .orderBy('notification.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return {
        items: notifications.map(n => this.toDto(n)),
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(request: IMarkAsReadRequest): Promise<boolean> {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "User not found");
      }

      await this._context.NotificationRepo
        .createQueryBuilder()
        .update(Notification)
        .set({ isRead: true })
        .where('id IN (:...ids)', { ids: request.notificationIds })
        .andWhere('userId = :userId', { userId: user.id })
        .execute();

      return true;
    } catch (error) {
      throw error;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "User not found");
      }

      await this._context.NotificationRepo
        .createQueryBuilder()
        .update(Notification)
        .set({ isRead: true })
        .where('userId = :userId', { userId: user.id })
        .andWhere('isRead = false')
        .execute();

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "User not found");
      }

      const count = await this._context.NotificationRepo
        .createQueryBuilder('notification')
        .where('notification.userId = :userId', { userId: user.id })
        .andWhere('notification.isRead = false')
        .getCount();

      return count;
    } catch (error) {
      throw error;
    }
  }

  async createNotification(request: ICreateNotificationRequest): Promise<INotificationDto> {
    try {
      const notification = this._context.NotificationRepo.create(request);
      const saved = await this._context.NotificationRepo.save(notification);

      // Send via socket
      const io = SocketService.getIO();
      if (io) {
        io.to(`user:${request.userId}`).emit('notification', this.toDto(saved));
      }

      return this.toDto(saved);
    } catch (error) {
      throw error;
    }
  }

  async deleteNotification(notificationId: number): Promise<boolean> {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "User not found");
      }

      const notification = await this._context.NotificationRepo.findOne({
        where: { id: notificationId, userId: user.id }
      });

      if (!notification) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Notification not found");
      }

      await this._context.NotificationRepo.remove(notification);
      return true;
    } catch (error) {
      throw error;
    }
  }

  private toDto(entity: Notification): INotificationDto {
    return {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      metadata: entity.metadata,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

