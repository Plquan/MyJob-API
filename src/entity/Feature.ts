import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PackageFeature } from "./PackageFeature";

@Entity("Feature")
export class Feature {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @OneToMany(() => PackageFeature, (pf) => pf.feature)
  packageFeatures: PackageFeature[]

}
