import { Entity,
         PrimaryGeneratedColumn,
         Column,
         CreateDateColumn,
         UpdateDateColumn, 
         OneToOne,
         OneToMany
        } from "typeorm";
import { GroupRole } from "./group-role";
import { Candidate } from "./candidate";
import { Company } from "./company";
import { RefreshToken } from "./refresh-token";
import { EUserRole } from "../common/enums/user/user-role-enum";
@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, unique:true})
    email!: string;

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
    role!: EUserRole;
 
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => Candidate, (candidate) => candidate.user)
    candidate?: Candidate;
    
    @OneToOne(() => Company, (company) => company.user)
    company?: Company;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => GroupRole, (groupRole) => groupRole.user)
    groupRole!: GroupRole[];
}