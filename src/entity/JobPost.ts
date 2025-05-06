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
import { Career } from './Career';
import { Company } from './Company';
import { Province } from './Province';
import { User } from './User';
import { SavedJob } from './SavedJob';
import { JobActivity } from './JobActivity';
  
  @Entity({ name: 'JobPosts' }) 
  export class JobPost {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    careerId!: number;
  
    @Column()
    companyId!: number;
  
    @Column()
    provinceId!: number;
  
    @Column()
    userId!: number;
  
    @Column({ type: 'varchar', length: 200 })
    jobName!: string;
  
    @Column({ type: 'varchar', length: 50,unique:true })
    slug!: string;
  
    @Column({ type: 'datetime', nullable: true })
    deadline?: Date;
  
    @Column({ type: 'int', nullable: true })
    quantity?: number;
  
    @Column({ type: 'longtext', nullable: true })
    jobDescription?: string;
  
    @Column({type: 'longtext', nullable: true })
    jobRequirement?: string;
  
    @Column({ type: 'longtext', nullable: true })
    benefitsEnjoyed?: string;
  
    @Column({ type: 'decimal', precision: 12, scale: 0})
    salaryMin!: number;
  
    @Column({ type: 'decimal', precision: 12, scale: 0})
    salaryMax!: number;
  
    @Column({ type: 'smallint'})
    position!: number;
  
    @Column({ type: 'smallint'})
    typeOfWorkPlace!: number;
  
    @Column({ type: 'smallint'})
    experience!: number;
  
    @Column({ type: 'smallint'})
    academicLevel!: number;
  
    @Column({ type: 'smallint'})
    jobType!: number;
  
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
  
    @Column({ type: 'bigint', default: () => 0 })
    views!: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @Column({type: 'int'})
    status!: number;

    @ManyToOne(() => Career, career => career.jobPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'careerId' })
    career!: Career;

    @ManyToOne(() => Company, company => company.jobPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    company!: Company;
  
    @ManyToOne(() => Province, province => province.jobPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "provinceId" })
    province!: Province;
      
    @ManyToOne(() => User, user => user.jobPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user!: User;
    
    @OneToMany(() => SavedJob, savedJob => savedJob.jobPost)
    savedJobs!: SavedJob[];

    @OneToMany(() => JobActivity, (activity) => activity.jobPost)
    jobActivities!: JobActivity[];

  }
  