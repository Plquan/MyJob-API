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
  
  @Entity('AdvancedSkills')
  export class AdvancedSkill {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    resumeId!:number;
  
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;
  
    @Column({ type: 'varchar', length: 200 })
    name!: string;
  
    @Column({ type: 'smallint' })
    level!: number;
  
    @ManyToOne(() => Resume, (resume) => resume.advancedSkills, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resumeId' })
    resume!: Resume;
  }
  