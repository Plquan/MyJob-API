import { Entity,
         PrimaryGeneratedColumn,
         Column,
         CreateDateColumn,
         UpdateDateColumn, 
         JoinColumn,
         OneToOne,
         OneToMany
        } from "typeorm";
import { GroupRole } from "./GroupRole";
import { Candidate } from "./Candidate";
import { Company } from "./Company";
import { JobPost } from "./JobPost";
import { Resume } from "./Resume";
import { SavedJobPost } from "./SavedJobPost";
import { CompanyFollowed } from "./CompanyFollowed";
import { JobPostActivity } from "./JobPostActivity";
import { RefreshToken } from "./RefreshToken";
import { MyJobFile } from "./MyJobFile";
@Entity({ name: 'User' })
export class User {
    
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({nullable:true})
    avatarId?:number;

    @Column({ type: "varchar", length: 255,unique:true})
    email!: string;

    @Column({ type: "varchar", length: 255})
    fullName!: string;

    @Column({ type: "varchar", length: 255})
    password!: string;

    @Column({ default: false })
    isVerifyEmail!: boolean;

    @Column({type: 'boolean', default: false})
    isActive!: boolean;

    @Column({type: 'boolean',default: false})
    isSuperUser!: boolean;

    @Column({type: 'boolean',default: false})
    isStaff!: boolean;

    @Column({ type: 'varchar', length: 10, nullable: true })
    roleName!: string;
 
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => Candidate, (candidate) => candidate.user)
    candidate!: Candidate;
    
    @OneToOne(() => Company, (company) => company.user)
    employer?: Company;

    @OneToMany(() => JobPost, (jobPost) => jobPost.user)
    jobPosts!: JobPost[];

    @OneToMany(() => SavedJobPost, SavedJobPost => SavedJobPost.user)
    savedJobPosts!: SavedJobPost[];

    @OneToMany(() => CompanyFollowed, companyFollowed => companyFollowed.user)
    followedCompanies!: CompanyFollowed[];

    @OneToMany(() => JobPostActivity, (activity) => activity.user)
    jobActivities!: JobPostActivity[];

    @OneToOne(() => MyJobFile, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'avatarId' })
    avatar?: MyJobFile;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => GroupRole, (groupRole) => groupRole.user)
    groupRole!: GroupRole[];
}