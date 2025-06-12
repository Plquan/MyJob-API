import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('MyJobFile')
export class MyJobFile {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!:number;

  @Column({ type: 'varchar', length: 255 })
  publicId!: string;

  @Column({ type: 'varchar', length: 255 })
  url!: string; 

  @Column({ type: 'varchar', length: 50 })
  fileType!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.avatar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

}
