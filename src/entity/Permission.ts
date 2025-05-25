import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Function } from "./Function";
import { GroupRole } from "./GroupRole";

@Entity({ name: "Permissions" })
export class Permission {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "boolean", nullable: false, default: false })
  isDeleted!: boolean;

  @Column({ type: "boolean", nullable: false, default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Function, (func) => func.permissions)
  @JoinColumn({ name: "functionId" })
  function!: Function;

  @ManyToOne(() => GroupRole, (groupRole) => groupRole.users)
  @JoinColumn({ name: "groupRoleId" })
  groupRole!: GroupRole;
  
}