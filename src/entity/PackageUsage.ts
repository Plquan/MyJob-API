import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { Feature } from "./Feature";
import { PackagePurchased } from "./PackagePurchased";

@Entity('PackageUsage')
export class PackageUsage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyPackageId!: number;

  @Column()
  featureId!: number;

  @Column({ type: 'int', default: 0 })
  used: number;

  @Column({ type: 'int', default: 0 })
  total: number;

  @ManyToOne(() => Feature, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'featureId' })
  feature: Feature;

  @ManyToOne(() => PackagePurchased, (cp) => cp.usages, {onDelete: 'CASCADE',nullable: false})
  @JoinColumn({ name: 'companyPackageId' })
  companyPackage: PackagePurchased;
}
