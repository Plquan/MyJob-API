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

@Entity('package_purchased')
export class PackagePurchased {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId!: number;

  @Column()
  packageId!: number;

  @Column()
  endDate: Date;

  @OneToMany(() => PackageUsage, (usage) => usage.companyPackage)
  usages: PackageUsage[]

  @ManyToOne(() => Package, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package

  @ManyToOne(() => Company, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company
}
