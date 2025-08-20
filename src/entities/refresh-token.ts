import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user";

@Entity('RefreshTokens')
export class RefreshToken {
  @PrimaryColumn({ type: "varchar", length: 255, nullable: false })
  id!: string;

  @Column()
  userId!: number; 

  @Column('text')
  token!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  expiresAt!: Date;

  @Column({ default: false })
  revoked!: boolean;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'userId'})
  user: User;
}
