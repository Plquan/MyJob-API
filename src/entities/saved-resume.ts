import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Resume } from './resume';
import { Company } from './company';

@Entity('saved_resumes')
export class SavedResume {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  resumeId!: number;

  @Column()
  companyId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Resume, resume => resume.savedResumes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resumeId' })
  resume!: Resume;

  @ManyToOne(() => Company, company => company.savedResumes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

}
