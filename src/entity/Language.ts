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
  
  @Entity('Languages')
  export class Language {
  
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    resumeId!:number;
  
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;
  
    @Column({ type: 'smallint', nullable: false })
    language!: number;
  
    @Column({ type: 'smallint', nullable: false })
    level!: number;  
  
    @ManyToOne(() => Resume, resume => resume.languages,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'resumeId' })
    resume!: Resume;

  }
  