import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Role } from "./role";

@Entity({ name: "GroupRoles" })
export class GroupRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roleId!: number;

  @Column()
  userId!:number

  @ManyToOne(() => User, (user) => user.groupRole)
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Role, (role) => role.groupRole)
  @JoinColumn({ name: "roleId" })
  role!: Role;
}