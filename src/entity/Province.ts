import { Entity,Column,PrimaryGeneratedColumn,OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./Company";
import { Candidate } from "./Candidate";
import { JobPost } from "./JobPost";
import { Resume } from "./Resume";
import { District } from "./District";
@Entity('Province')
export class Province {

    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: "varchar", length: 255,})
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Candidate, (candidate) => candidate.province)
    candidates!: Candidate[];

    @OneToMany(() => Company, (company) => company.province)
    employers!: Company[];

    @OneToMany(() => JobPost, (jobPost) => jobPost.province)
    jobPosts!: JobPost[];

    @OneToMany(() => Resume, resume => resume.province)
    resumes!: Resume[];

    @OneToMany(() => District, (district) => district.province)
    districts!: District[];
}