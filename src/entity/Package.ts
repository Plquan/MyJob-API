import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { PackageFeature } from "./PackageFeature";
import { PackageType } from "./PackageType";

@Entity("Package")
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  packageTypeId: number;

  @ManyToOne(() => PackageType, (pt) => pt.packages,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'packageTypeId' })
  packageType: PackageType;

  @OneToMany(() => PackageFeature, (pf) => pf.package)
  packageFeatures: PackageFeature[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
