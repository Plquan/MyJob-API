import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Resume } from './resume';

@Entity('certificates')
export class Certificate {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  resumeId!:number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  trainingPlace!: string;

  @Column({ type: 'date', nullable: false })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  expirationDate?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Resume, (resume) => resume.certificates, {onDelete:'CASCADE'})
  @JoinColumn({ name: 'resumeId' })
  resume!: Resume;
}
