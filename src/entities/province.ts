import { Entity,Column,PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('provinces')
export class Province {

    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: "varchar", length: 255,})
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}