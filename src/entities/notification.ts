import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";

export enum NotificationType {
  JOB_POST_APPROVED = "JOB_POST_APPROVED",
  JOB_POST_REJECTED = "JOB_POST_REJECTED",
  APPLICATION_STATUS_CHANGED = "APPLICATION_STATUS_CHANGED",
  NEW_APPLICATION = "NEW_APPLICATION",
}

@Entity('notifications')
export class Notification {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: any;

  @Column({ type: "boolean", default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;
}

