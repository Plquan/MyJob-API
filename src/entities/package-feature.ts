import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EFeatureKey } from "../common/enums/package-features/EFeatureKey";
import { Package } from "./package";

@Entity('package_features')
export class PackageFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageId: number;

  @Column({ type: 'enum', enum: EFeatureKey })
  featureKey: EFeatureKey;

  @Column({ type: 'int', nullable: true })
  quota: number;

  @Column({ default: false })
  unlimited: boolean;

  @Column({ type: "text" })
  description: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Package, (pkg) => pkg.packageFeatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package;
}
