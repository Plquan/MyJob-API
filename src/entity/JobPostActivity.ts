import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { JobPost } from './JobPost';
import { Resume } from './Resume';
import { User } from './User';
  
 @Entity('JobPostActivity')
export class JobPostActivity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  jobPostId!: number;

  @Column({ nullable: true })
  resumeId?: number;

  @Column()
  userId!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone?: string;

  @Column({ type: 'int' }) 
  status!: number;

  @Column({ type: 'boolean', default: false }) 
  isSentMail!: boolean;

  @Column({ type: 'boolean', default: false }) 
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.jobPostActivities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobPostId' })
  jobPost!: JobPost;

  @ManyToOne(() => Resume, (resume) => resume.jobActivities, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resumeId' })
  resume?: Resume;

  @ManyToOne(() => User, (user) => user.jobActivities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}

  