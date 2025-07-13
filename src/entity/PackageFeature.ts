import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Feature } from "./Feature";
import { Package } from "./Package";

@Entity({ name: "PackageFeature" })
export class PackageFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageId: number;

  @Column()
  featureId: number;

  @Column({ type: 'int', nullable: true })
  quota: number;

  @Column({ default: false })
  unlimited: boolean;

  @Column({ type: "text"})
  description: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Package, (pkg) => pkg.packageFeatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @ManyToOne(() => Feature, (f) => f.packageFeatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'featureId' })
  feature: Feature;
}
