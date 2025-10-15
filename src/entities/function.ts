import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permission } from "./permission";

@Entity('functions')
export class Function {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 1000, nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 1000, nullable: false })
  codeName!: string;

  @OneToMany(() => Permission, (permission) => permission.function)
  permissions!: Permission[];
  
}