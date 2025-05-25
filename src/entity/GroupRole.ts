import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Permission } from "./Permission";

@Entity({ name: "GroupRoles" })
export class GroupRole {
  
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

  @OneToMany(() => User, (user) => user.groupRole)
  users!: User[];

  @OneToMany(() => Permission, (permission) => permission.groupRole)
  permissions!: Permission[];
  
}