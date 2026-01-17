import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("packages")
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 0 })
  price: number;

  @Column({ type: 'int' })
  durationInDays: number;
  
  @Column({ type: 'int', default: 0 })
  jobPostDurationInDays: number;

  @Column({ type: 'int', default: 0 })
  jobHotDurationInDays: number;

  @Column({ type: 'int', default: 0 })
  highlightCompanyDurationInDays: number;

  @Column({ type: 'int', default: 0 })
  candidateSearchLimit: number;

  @Column({ type: 'int', default: 0 })
  jobPostLimit: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
