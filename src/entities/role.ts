import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Entity } from "typeorm";
import { Permission } from "./permission";
import { GroupRole } from "./group-role";

@Entity("Roles")
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 1000})
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions!: Permission[];

  @OneToMany(() => GroupRole, (groupRole) => groupRole.role)
  groupRole!: GroupRole[];
  
}