import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Function } from "./function";
import { Role } from "./role";

@Entity({ name: "Permissions" })
export class Permission {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roleId!: number;

  @Column()
  functionId!:number

  @ManyToOne(() => Function, (func) => func.permissions)
  @JoinColumn({ name: "functionId" })
  function!: Function;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: "roleId" })
  role!: Role;
  
}