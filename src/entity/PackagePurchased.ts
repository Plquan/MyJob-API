import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Company } from "./Company";
import { Package } from "./Package";
import { PackageUsage } from "./PackageUsage";

@Entity("PackagePurchased")
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
