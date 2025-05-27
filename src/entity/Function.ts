import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permission } from "./Permission";

@Entity({ name: "Function" })
export class Function {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 1000, nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 1000, nullable: false })
  displayName!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  functionLink!: string;

  @Column({ type: "boolean", nullable: false, default: false })
  isDeleted!: boolean;

  @Column({ type: "boolean", nullable: false, default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Permission, (permission) => permission.function)
  permissions!: Permission[];
  
}