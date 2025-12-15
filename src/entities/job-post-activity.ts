import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { JobPost } from './job-post';
import { Resume } from './resume';
import { Candidate } from './candidate';
import { EJobPostActivityStatus } from '@/common/enums/job/EJobPostActivity';
  
 @Entity('job_post_activities')
export class JobPostActivity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  jobPostId!: number;

  @Column({ nullable: true })
  resumeId?: number;

  @Column()
  candidateId!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: EJobPostActivityStatus})
  status!: EJobPostActivityStatus;

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

  @ManyToOne(() => Candidate, (candidate) => candidate.jobActivities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidateId' })
  candidate!: Candidate;
}

  