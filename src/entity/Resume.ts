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
import { User } from './User';
import { Province } from './Province';
import { Candidate } from './Candidate';
import { Career } from './Career';
import { Language } from './Language';
import { Experience } from './Experience';
import { Education } from './Education';
import { Certificate } from './Certificate';
import { JobPostActivity } from './JobPostActivity';
import { AdvancedSkill } from './AdvancedSkill';
import { MyJobFile } from './MyJobFile';

@Entity('Resume')
export class Resume {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  candidateId!: number;

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

  @Column({ type: 'smallint', nullable: true })
  position?: number;

  @Column({ type: 'smallint', nullable: true })
  typeOfWorkPlace?: number;

  @Column({ type: 'smallint', nullable: true })
  experience?: number;

  @Column({ type: 'smallint', nullable: true })
  academicLevel?: number;

  @Column({ type: 'smallint', nullable: true })
  jobType?: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  type?: string;

  @Column({ type: 'boolean', default: false })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Career, (career) => career.resumes)
  @JoinColumn({ name: 'careerId' })
  career!: Career;

  @ManyToOne(() => Province, { nullable: true })
  @JoinColumn({ name: 'provinceId' })
  province?: Province;

  @ManyToOne(() => Candidate, candidate => candidate.resumes, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidateId' })
  candidate!: Candidate;

  @OneToOne(() => MyJobFile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'myJobFileId' })
  MyJobFile?: MyJobFile;

  @OneToMany(() => Language, language => language.resume)
  languages!: Language[];

  @OneToMany(() => Experience, experience => experience.resume)
  experiences!: Experience[];

  @OneToMany(() => Education, education => education.resume)
  educations!: Education[];

  @OneToMany(() => Certificate, certificate => certificate.resume)
  certificates!: Certificate[];

  @OneToMany(() => AdvancedSkill, advancedSkill => advancedSkill.resume)
  advancedSkills!: AdvancedSkill[];

  @OneToMany(() => JobPostActivity, activity => activity.resume)
  jobActivities!: JobPostActivity[];
}
