import { Entity, OneToOne,PrimaryGeneratedColumn,Column,JoinColumn,OneToMany,ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { JobPost } from "./JobPost";
import { Province } from "./Province";
import { CompanyFollowed } from "./CompanyFollowed";

@Entity('Company')
export class Company {
  
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: true})
    provinceId?:number;

    @Column()
    userId!:number;

    @Column({ type: 'varchar', length: 255 })
    companyName!: string;

    @Column({ type: 'varchar', length: 100 })
    companyEmail!: string;

    @Column({ type: 'varchar', length: 15 })
    companyPhone!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    websiteUrl?: string;

    @Column({ type: 'varchar', length: 30 })
    taxCode!: string;

    @Column({ type: 'date', nullable: true })
    since?: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    fieldOperation?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'smallint', nullable: true })
    employeeSize?: number;

    @Column({ type: 'varchar', length: 100 })
    address!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => User, (user) => user.employer,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user!: User;

    @ManyToOne(() => Province, { onDelete: 'SET NULL',nullable: true })
    @JoinColumn({ name: 'provinceId' })
    province?: Province;

    @OneToMany(() => JobPost, (jobpost) => jobpost.user)
    job!: JobPost[];

    @OneToMany(() => JobPost, jobPost => jobPost.company)
    jobPosts?: JobPost[];

    @OneToMany(() => CompanyFollowed, companyFollowed => companyFollowed.company)
    followedCompanies!: CompanyFollowed[];
  
} 