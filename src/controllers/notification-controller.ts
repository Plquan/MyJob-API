import { Auth } from "@/common/middlewares";
import INotificationService from "@/interfaces/notification/notification-interface";
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";

@before(inject(Auth.required))
@route('/notifications')
export class NotificationController {
  private readonly _notificationService: INotificationService;

  constructor(NotificationService: INotificationService) {
    this._notificationService = NotificationService;
  }

  @GET()
  async getNotifications(req: Request, res: Response) {
    const { page, limit, isRead } = req.query;

    const response = await this._notificationService.getNotifications({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      isRead: isRead !== undefined ? isRead === 'true' : undefined,
    });

    return res.status(200).json(response);
  }

  @GET()
  @route('/unread-count')
  async getUnreadCount(req: Request, res: Response) {
    const count = await this._notificationService.getUnreadCount();
    return res.status(200).json({ count });
  }

  @PUT()
  @route('/mark-as-read')
  async markAsRead(req: Request, res: Response) {
    const { notificationIds } = req.body;
    const response = await this._notificationService.markAsRead({ notificationIds });
    return res.status(200).json(response);
  }

  @PUT()
  @route('/mark-all-as-read')
  async markAllAsRead(req: Request, res: Response) {
    const response = await this._notificationService.markAllAsRead();
    return res.status(200).json(response);
  }

  @DELETE()
  @route('/:notificationId')
  async deleteNotification(req: Request, res: Response) {
    const notificationId = parseInt(req.params.notificationId);
    const response = await this._notificationService.deleteNotification(notificationId);
    return res.status(200).json(response);
  }
}

