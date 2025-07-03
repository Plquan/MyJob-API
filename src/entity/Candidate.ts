import { Entity, OneToOne,PrimaryGeneratedColumn,Column,JoinColumn,OneToMany,ManyToOne } from "typeorm";
import { User } from "./User";
import { Province } from "./Province";
import { Resume } from "./Resume";
import { District } from "./District";

@Entity('Candidate')
export class Candidate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column({ nullable: true })
    provinceId?: number;

    @Column({ nullable: true })
    districtId?: number;

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone?: string;

    @Column({ type: 'date', nullable: true })
    birthday?: Date;

    @Column({  type: 'smallint', nullable: true })
    gender?: string;

    @Column({  type: 'smallint' , nullable: true })
    maritalStatus?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    address?: string;

    @Column({ type: 'boolean', default: false })
    allowSearch!: boolean;

    @OneToOne(() => User, (user) => user.candidate, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => Province, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'provinceId' })
    province?: Province;

    @ManyToOne(() => District, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'districtId' })
    district?: District;

    @OneToMany(() => Resume, resume => resume.candidate)
    resumes!: Resume[];
}
