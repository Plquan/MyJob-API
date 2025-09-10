import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
import { Career } from './career';
import { Company } from './company';
import { Province } from './province';
import { SavedJobPost } from './save-job-post';
import { JobPostActivity } from './job-post-activity';
import { EPosition, ETypeOfWorkplace, EExperience, EAcademicLevel, EJobType } from '../common/enums/resume/resume-enum';
import { EJobPostStatus } from '../common/enums/job/EJobPostStatus';
  
  @Entity('job_post') 
  export class JobPost {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    careerId!: number;
  
    @Column()
    companyId!: number;
  
    @Column()
    provinceId!: number;
  
    @Column({ type: 'varchar', length: 200 })
    jobName!: string;
  
    @Column({ type: 'timestamp', nullable: true })
    deadline?: Date;
  
    @Column({ type: 'int', nullable: true })
    quantity?: number;
  
    @Column({ type: 'text', nullable: true })
    jobDescription?: string;
  
    @Column({type: 'text', nullable: true })
    jobRequirement?: string;
  
    @Column({ type: 'text', nullable: true })
    benefitsEnjoyed?: string;
  
    @Column({ type: 'decimal', precision: 12, scale: 0})
    salaryMin!: number;
  
    @Column({ type: 'decimal', precision: 12, scale: 0})
    salaryMax!: number;
  
    @Column({ type: 'enum', enum: EPosition})
    position!: EPosition;

    @Column({ type: 'enum', enum: ETypeOfWorkplace})
    typeOfWorkPlace!: ETypeOfWorkplace;

    @Column({ type: 'enum', enum: EExperience})
    experience!: EExperience;

    @Column({ type: 'enum', enum: EAcademicLevel})
    academicLevel!: EAcademicLevel;
  
    @Column({ type: 'enum', enum: EJobType})
    jobType!: EJobType;
  
    @Column({type: 'boolean', default: false})
    isHot!: boolean;
  
    @Column({type: 'boolean', default: false })
    isUrgent!: boolean;
  
    @Column({type: 'boolean',default: false })
    isActive!: boolean;
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    contactPersonName?: string;
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    contactPersonEmail?: string;
  
    @Column({ type: 'varchar', length: 15, nullable: true })
    contactPersonPhone?: string;
  
    @Column({ type: 'bigint', default: 0 })
    views!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
    
    @Column({ type: 'enum', enum: EJobPostStatus, default: EJobPostStatus.DRAFT })
    status!: EJobPostStatus;

    @ManyToOne(() => Career, career => career.jobPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'careerId' })
    career!: Career;

    @ManyToOne(() => Company, company => company.jobPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    company!: Company;
  
    @ManyToOne(() => Province, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "provinceId" })
    province!: Province;
      
    @OneToMany(() => SavedJobPost, savedJob => savedJob.jobPost)
    savedJobPosts!: SavedJobPost[];

    @OneToMany(() => JobPostActivity, (activity) => activity.jobPost)
    jobPostActivities!: JobPostActivity[];

  }
  