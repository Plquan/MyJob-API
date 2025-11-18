import { Entity, OneToOne, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { User } from "./user";
import { Province } from "./province";
import { Resume } from "./resume";
import { District } from "./district";
import { EGender, EMartialStatus } from "../common/enums/candidate/candidate-enum";
import { JobPostActivity } from "./job-post-activity";
import { SavedJobPost } from "./saved-job-post";
import { FollowedCompany } from "./followed-company";

@Entity('candidates')
export class Candidate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column({ nullable: true })
    provinceId?: number;

    @Column({ nullable: true })
    districtId?: number;

    @Column({ type: "varchar", length: 255})
    fullName!: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone?: string;

    @Column({ type: 'date', nullable: true })
    birthday?: Date;

    @Column({ type: 'enum', enum: EGender, nullable: true })
    gender?: EGender;

    @Column({ type: 'enum', enum: EMartialStatus, nullable: true })
    maritalStatus?: EMartialStatus;

    @Column({ type: "varchar", length: 255, nullable: true })
    address?: string;

    @Column({ type: 'boolean', default: false })
    allowSearch!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

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

    @OneToMany(() => JobPostActivity, (activity) => activity.candidate)
    jobActivities?: JobPostActivity[];

    @OneToMany(() => FollowedCompany, companyFollowed => companyFollowed.candidate)
    followedCompanies?: FollowedCompany[];

    @OneToMany(() => SavedJobPost, SavedJobPost => SavedJobPost.candidate)
    savedJobPosts?: SavedJobPost[];
}
