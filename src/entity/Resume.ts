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
import { JobActivity } from './JobActivity';
import { AdvancedSkill } from './AdvancedSkill';
import { MediaFile } from './MediaFile';

@Entity('Resumes')
export class Resume {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({nullable: true})
  mediaFileId?:number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  slug?: string;

  @Column({ type: 'longtext', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 12, scale: 0 })
  salary_min!: number;

  @Column({ type: 'decimal', precision: 12, scale: 0 })
  salary_max!: number;

  @Column({ type: 'smallint', nullable: true })
  position!: number;

  @Column({ type: 'smallint', nullable: true })
  typeOfWorkPlace!: number;

  @Column({ type: 'smallint', nullable: true })
  experience!: number;

  @Column({ type: 'smallint', nullable: true })
  academicLevel!: number;

  @Column({ type: 'smallint', nullable: true })
  jobType!: number;

  @Column({ type: 'boolean', default: false })
  is_active!: boolean;

  @Column({ type: 'varchar', length: 10,nullable: true })
  type?: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt!: Date;

  @ManyToOne(() => Career, (career) => career.resumes)
  @JoinColumn({ name: 'careerId' })  
  career!: Career;

  @ManyToOne(() => Province, (province) => province.resumes, { nullable: true })
  @JoinColumn({ name: 'provinceId' })
  province?: Province;

  @OneToOne(() => Candidate, candidate => candidate.resume)
  candidate!: Candidate;

  @ManyToOne(() => User, user => user.resumes)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToOne(() => MediaFile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaFileId' })
  mediaFile?: MediaFile;

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


  @OneToMany(() => JobActivity, activity => activity.resume)
  jobActivities!: JobActivity[];


}
