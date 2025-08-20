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
  
  @Entity('Experiences')
  export class Experience {
  
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    resumeId!: number
  
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: 'varchar', length: 200, nullable: false })
    jobName!: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    companyName!: string;
  
    @Column({ type: 'date', nullable: false })
    startDate!: Date;
  
    @Column({ type: 'date', nullable: false })
    endDate!: Date;
  
    @Column({ type: 'varchar', length: 500, nullable: true })
    description?: string;
  
    @ManyToOne(() => Resume, (resume) => resume.experiences,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'resumeId' })
    resume!: Resume;

  }
  