import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PackageFeature } from "./PackageFeature"

@Entity("Package")
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 0})
  price: number;

  @Column({ type: 'int', nullable: true })
  durationInDays: number;

  @OneToMany(() => PackageFeature, (pf) => pf.package)
  packageFeatures: PackageFeature[]

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
