import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { JobPost } from './job-post';
import { Candidate } from './candidate';

@Entity('SavedJobPosts')
export class SavedJobPost {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  jobPostId!: number;

  @Column()
  candidateId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => JobPost, jobPost => jobPost.savedJobPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobPostId' })
  jobPost!: JobPost;

  @ManyToOne(() => Candidate, Candidate => Candidate.savedJobPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidateId' })
  candidate!: Candidate;

}
