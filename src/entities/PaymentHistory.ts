import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Package } from "./package";

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

@Entity("PaymentHistories")
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  packageId: number;

  @ManyToOne(() => Package, { onDelete: "SET NULL" })
  @JoinColumn({ name: "packageId" })
  package: Package;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ default: "CASH" })
  paymentMethod: string;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: "timestamp", nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
