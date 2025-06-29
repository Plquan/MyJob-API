import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Package } from "./Package";
import { Feature } from "./Feature";

@Entity('PackageType')
export class PackageType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Package, (pkg) => pkg.packageType)
  packages: Package[];

  @OneToMany(() => Feature, (pkg) => pkg.packageType)
  features: Feature[];
}
