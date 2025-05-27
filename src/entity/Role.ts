import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Entity } from "typeorm";
import { Permission } from "./Permission";
import { GroupRole } from "./GroupRole";

@Entity("Role")
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 1000})
  name!: string;

  @Column({ type: "varchar", length: 1000})
  displayName!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions!: Permission[];

  @OneToMany(() => GroupRole, (groupRole) => groupRole.role)
  groupRole!: GroupRole[];
}