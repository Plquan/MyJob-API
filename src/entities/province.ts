import { Entity,Column,PrimaryGeneratedColumn,OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { District } from "./district";

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

    @OneToMany(() => District, (district) => district.province)
    districts!: District[];
}