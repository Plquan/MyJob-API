import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Province } from './province';
import { Candidate } from './candidate';
import { Career } from './career';
import { Language } from './language';
import { Experience } from './experience';
import { Education } from './education';
import { Certificate } from './certificate';
import { JobPostActivity } from './job-post-activity';
import { MyJobFile } from './myjob-file';
import { Skill } from './skill';
import { EAcademicLevel, EExperience, EJobType, EPosition, EResumeType, ETypeOfWorkplace } from '../common/enums/resume/resume-enum';

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  candidateId!: number;

  @Column({ nullable: true })
  careerId?:number

  @Column({ nullable: true })
  provinceId?:number

  @Column({ nullable: true })
  myJobFileId?: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 15, scale: 0,nullable: true })
  salaryMin?: number;

  @Column({ type: 'decimal', precision: 15, scale: 0,nullable: true })
  salaryMax?: number;

  @Column({ type: 'enum', enum: EPosition, nullable: true })
  position?: EPosition;

  @Column({ type: 'enum', enum: ETypeOfWorkplace, nullable: true })
  typeOfWorkPlace?: ETypeOfWorkplace;

  @Column({ type: 'enum', enum: EExperience, nullable: true })
  experience?: EExperience;

  @Column({ type: 'enum', enum: EAcademicLevel, nullable: true })
  academicLevel?: EAcademicLevel;

  @Column({ type: 'enum', enum: EJobType,nullable: true })
  jobType?: EJobType;

  @Column({ type: 'enum', enum: EResumeType})
  type!: EResumeType;

  @Column({ type: 'boolean', default: false })
  selected!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Career, (career) => career.resumes, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'careerId' })
  career?: Career;

  @ManyToOne(() => Province, { nullable: true , onDelete: 'SET NULL' })
  @JoinColumn({ name: 'provinceId' })
  province?: Province;

  @ManyToOne(() => Candidate, candidate => candidate.resumes,{ onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidateId' })
  candidate!: Candidate;

  @OneToOne(() => MyJobFile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'myJobFileId' })
  myJobFile?: MyJobFile;

  @OneToMany(() => Language, language => language.resume)
  languages!: Language[];

  @OneToMany(() => Experience, experience => experience.resume)
  experiences!: Experience[];

  @OneToMany(() => Education, education => education.resume)
  educations!: Education[];

  @OneToMany(() => Certificate, certificate => certificate.resume)
  certificates!: Certificate[];

  @OneToMany(() => Skill, skill => skill.resume)
  skills!: Skill[];

  @OneToMany(() => JobPostActivity, activity => activity.resume)
  jobActivities!: JobPostActivity[];
}
