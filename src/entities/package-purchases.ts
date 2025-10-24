import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Company } from "./company";
import { Package } from "./package";
import { PackageUsage } from "./package-usage";

@Entity('package_purchases')
export class PackagePurchases {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId!: number;

  @Column()
  packageId!: number;

  @Column()
  endDate: Date;

  @ManyToOne(() => Package, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package

  @ManyToOne(() => Company, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company
}
