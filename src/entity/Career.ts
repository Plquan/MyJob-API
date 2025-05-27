import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
import { JobPost } from './JobPost';
import { Resume } from './Resume';
  
  @Entity('Career') 
  export class Career {

    @PrimaryGeneratedColumn()
    id!: number;
     
    @Column({ type: 'varchar', length: 150 })
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => JobPost, jobPost => jobPost.career)
    jobPosts!: JobPost[];

    @OneToMany(() => Resume, resume => resume.career) 
    resumes!: Resume[];

  }
  