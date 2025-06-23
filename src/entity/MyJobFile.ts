import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn } from 'typeorm';
import { User } from './User';
import { Resume } from './Resume';

@Entity('MyJobFile')
export class MyJobFile {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  publicId!: string;

  @Column({ type: 'varchar', length: 255 })
  url!: string; 

  @Column({ type: 'varchar', length: 50 })
  fileType!: string;

  @Column({ type: 'varchar', length: 50 })
  resourceType!: string;
  
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToOne(() => User, (user) => user.avatar)
  user?: User

  @OneToOne(() => Resume, (resume) => resume.myJobFile)
  resume?: Resume
}
