import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Province } from "./province";

@Entity({ name: 'Districts' })
export class District {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    provinceId!: number;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Province, (province) => province.districts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provinceId' })
    province!: Province;
}
