import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { Resume } from './Resume';
  @Entity('Education')
  export class Education {
  
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    resumeId!:number;
  
    @Column({ type: 'varchar', length: 200, nullable: false })
    degreeName!: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    major!: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    trainingPlace!: string;
  
    @Column({ type: 'date', nullable: false })
    startDate!: Date;
  
    @Column({ type: 'date', nullable: true })
    completedDate?: Date;
  
    @Column({ type: 'varchar', length: 500, nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
  
    @ManyToOne(() => Resume, (resume) => resume.educations,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'resumeId' })
    resume!: Resume;
  }
  