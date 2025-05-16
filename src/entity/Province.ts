import { Entity,Column,PrimaryGeneratedColumn,OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./Company";
import { Candidate } from "./Candidate";
import { JobPost } from "./JobPost";
import { Resume } from "./Resume";
@Entity({ name: 'Provinces' })
export class Province {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int" })
    code!: number;
  
    @Column({ type: "varchar", length: 255,})
    name!: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @OneToMany(() => Candidate, (candidate) => candidate.province)
    candidates!: Candidate[];

    @OneToMany(() => Company, (company) => company.province)
    employers!: Company[];

    @OneToMany(() => JobPost, (jobPost) => jobPost.province)
    jobPosts!: JobPost[];

    @OneToMany(() => Resume, resume => resume.province)
    resumes!: Resume[];
}