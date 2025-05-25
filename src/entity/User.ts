import { Entity,
         PrimaryGeneratedColumn,
         Column,
         CreateDateColumn,
         UpdateDateColumn, 
         JoinColumn,
         ManyToOne,
         OneToOne,
         OneToMany
        } from "typeorm";
import { GroupRole } from "./GroupRole";
import { Candidate } from "./Candidate";
import { Company } from "./Company";
import { JobPost } from "./JobPost";
import { Resume } from "./Resume";
import { SavedJob } from "./SavedJob";
import { CompanyFollowed } from "./CompanyFollowed";
import { JobActivity } from "./JobActivity";
import { MediaFile } from "./MediaFile";
import { RefreshToken } from "./RefreshToken";
@Entity({ name: 'Users' })
export class User {
    
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    groupRoleId!:number;

    @Column({nullable:true})
    avatarId?:number;

    @Column({ type: "varchar", length: 255,unique:true})
    email!: string;

    @Column({ type: "varchar", length: 255})
    fullName!: string;

    @Column({ type: "varchar", length: 255})
    password!: string;

    @Column({ default: false })
    isVerified!: boolean;

    @Column({type: 'boolean', default: false})
    isActive!: boolean;

    @Column({type: 'boolean',default: false})
    isDeleted!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => GroupRole,(groupRole) => groupRole.users)
    @JoinColumn({ name: "groupRoleId" })
    groupRole!: GroupRole;

    @OneToOne(() => Candidate, (candidate) => candidate.user)
    candidate!: Candidate;
    
    @OneToOne(() => Company, (company) => company.user)
    employer?: Company;

    @OneToMany(() => JobPost, (jobPost) => jobPost.user)
    jobPosts!: JobPost[];

    @OneToMany(() => Resume, resume => resume.user)
    resumes!: Resume[];

    @OneToMany(() => SavedJob, savedJob => savedJob.user)
    savedJobs!: SavedJob[];

    @OneToMany(() => CompanyFollowed, companyFollowed => companyFollowed.user)
    followedCompanies!: CompanyFollowed[];

    @OneToMany(() => JobActivity, (activity) => activity.user)
    jobActivities!: JobActivity[];

    @OneToOne(() => MediaFile, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'avatarId' })
    mediaFile?: MediaFile;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];
}