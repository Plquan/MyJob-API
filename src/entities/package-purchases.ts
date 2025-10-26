import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";
import { Company } from "./company";
import { Package } from "./package";

@Entity('package_purchases')
export class PackagePurchases {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId!: number;

  @Column()
  packageId!: number;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod?: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentDate?: Date;

  @ManyToOne(() => Package, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package

  @ManyToOne(() => Company, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company
}
