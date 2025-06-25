import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PackageFeature } from "./PackageFeature";

@Entity("Feature")
export class Feature {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ default: false })
  allowLimit: boolean

  @OneToMany(() => PackageFeature, (pf) => pf.feature)
  packageFeatures: PackageFeature[]
}
