import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';

  @Entity('MyJobFile')
  export class MyJobFile {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!:number;

    @Column({ type: 'varchar', length: 512 })
    url!: string;

    @Column({ type: 'varchar', length: 50 })
    fileType!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
  }
  