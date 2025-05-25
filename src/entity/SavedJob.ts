import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { JobPost } from './JobPost';  
  import { User } from './User'; 
  
  @Entity('SavedJobs')
  export class SavedJob {
  
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    jobPostId!:number;

    @Column()
    userId!:number;
  
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
  
    @ManyToOne(() => JobPost, jobPost => jobPost.savedJobs,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'jobPostId' })
    jobPost!: JobPost;
  
    @ManyToOne(() => User, user => user.savedJobs,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'userId' })
    user!: User;
  }
  