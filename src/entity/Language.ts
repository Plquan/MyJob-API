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
  
  @Entity('Language')
  export class Language {
  
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    resumeId!:number;
  
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: 'smallint'})
    language!: number;
  
    @Column({ type: 'smallint'})
    level!: number;  
  
    @ManyToOne(() => Resume, resume => resume.languages,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'resumeId' })
    resume!: Resume;
  }
  