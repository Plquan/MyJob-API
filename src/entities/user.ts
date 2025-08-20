import { Entity,
         PrimaryGeneratedColumn,
         Column,
         CreateDateColumn,
         UpdateDateColumn, 
         JoinColumn,
         OneToOne,
         OneToMany
        } from "typeorm";
import { GroupRole } from "./group-role";
import { Candidate } from "./candidate";
import { Company } from "./company";
import { RefreshToken } from "./refresh-token";
import { MyJobFile } from "./my-job-file";
import { EUserRole } from "../common/enums/user/user-role-enum";
@Entity({ name: 'Users' })
export class User {
    
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ type: 'int', nullable: true })
    avatarId?: number;

    @Column({ type: "varchar", length: 255, unique:true})
    email!: string;

    @Column({ type: "varchar", length: 255})
    fullName!: string;

    @Column({ type: "varchar", length: 255})
    password!: string;

    @Column({type: 'boolean', default: false })
    isVerifyEmail!: boolean;

    @Column({type: 'boolean', default: false})
    isActive!: boolean;

    @Column({type: 'boolean',default: false})
    isSuperUser!: boolean;

    @Column({type: 'boolean',default: false})
    isStaff!: boolean;

    @Column({ type: 'enum', enum: EUserRole})
    roleName!: EUserRole;
 
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => Candidate, (candidate) => candidate.user)
    candidate?: Candidate;
    
    @OneToOne(() => Company, (company) => company.user)
    employer?: Company;

    @OneToOne(() => MyJobFile, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'avatarId' })
    avatar?: MyJobFile;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => GroupRole, (groupRole) => groupRole.user)
    groupRole!: GroupRole[];
}