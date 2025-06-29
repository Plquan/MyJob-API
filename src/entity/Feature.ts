import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PackageFeature } from "./PackageFeature";
import { PackageType } from "./PackageType";

@Entity("Feature")
export class Feature {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  packageTypeId: number

  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({ type: "text", nullable: true })
  description: string

  @OneToMany(() => PackageFeature, (pf) => pf.feature)
  packageFeatures: PackageFeature[]

  @ManyToOne(() => PackageType, (pt) => pt.features,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'packageTypeId' })
  packageType: PackageType
}
