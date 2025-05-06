import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
  } from 'typeorm';
import { User } from './User';
  
  @Entity('MediaFile')
  export class MediaFile {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!:number;
  
    @Column({ type: 'varchar', length: 255 })
    public_id!: string;
  
    @Column({ type: 'varchar', length: 50 })
    format!: string;
  
    @Column({ type: 'varchar', length: 50 })
    resourceType!: string;
  
    @Column({ type: 'datetime', precision: 6 })
    uploadedAt!: Date;
  
    @Column({ type: 'longtext', charset: 'utf8mb4', collation: 'utf8mb4_bin', nullable: true })
    metadata?: string;
  
    @Column({ type: 'varchar', length: 20, nullable: true })
    version?: string;
  
    @Column({ type: 'varchar', length: 50 })
    fileType!: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;
  }
  