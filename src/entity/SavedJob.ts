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
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    create_at!: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    update_at!: Date;
  
    @ManyToOne(() => JobPost, jobPost => jobPost.savedJobs,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'jobPostId' })
    jobPost!: JobPost;
  
    @ManyToOne(() => User, user => user.savedJobs,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'userId' })
    user!: User;
  }
  