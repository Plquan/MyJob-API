import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
import { JobPost } from './job-post';
import { Resume } from './resume';
  
  @Entity('Careers') 
  export class Career {

    @PrimaryGeneratedColumn()
    id!: number;
     
    @Column({ type: 'varchar', length: 150 })
    name!: string;

    @Column({ type: 'varchar', length: 50 })
    icon!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => JobPost, jobPost => jobPost.career)
    jobPosts!: JobPost[];

    @OneToMany(() => Resume, resume => resume.career) 
    resumes!: Resume[];

  }
  