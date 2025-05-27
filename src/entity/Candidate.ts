import { Entity, OneToOne,PrimaryGeneratedColumn,Column,JoinColumn,OneToMany,ManyToOne } from "typeorm";
import { User } from "./User";
import { Province } from "./Province";
import { Resume } from "./Resume";

@Entity('Candidate')
export class Candidate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column({ nullable: true })
    provinceId?: number;

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone?: string;

    @Column({ type: 'date', nullable: true })
    birthday?: Date | null;

    @Column({ type: 'varchar', length: 1, nullable: true })
    gender?: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    maritalStatus?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    address?: string;

    @OneToOne(() => User, (user) => user.candidate, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => Province, (province) => province.candidates, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'provinceId' })
    province?: Province;

    @OneToMany(() => Resume, resume => resume.candidate)
    resumes!: Resume[];
}
