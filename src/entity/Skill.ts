import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Resume } from './Resume'; // Giả sử bảng Resume đã được định nghĩa
  
  @Entity('Skill')
  export class Skill {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    resumeId!:number;
  
    @Column({ type: 'varchar', length: 200 })
    name!: string;
  
    @Column({ type: 'smallint' })
    level!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Resume, (resume) => resume.skills, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resumeId' })
    resume!: Resume;
  }
  