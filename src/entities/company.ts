import { Entity, OneToOne, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { JobPost } from "./job-post";
import { Province } from "./province";
import { CompanyImage } from "./company-image";
import { FollowedCompany } from "./followed-company";
import { PackageUsage } from "./package-usage";
import { SavedResume } from "./saved-resume";

@Entity('companies')
export class Company {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    provinceId?: number;

    @Column()
    userId!: number;

    @Column({ type: 'varchar', length: 255 })
    companyName!: string;

    @Column({ type: 'varchar', length: 100 })
    companyEmail!: string;

    @Column({ type: 'varchar', length: 15 })
    companyPhone!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    websiteUrl?: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    youtubeUrl?: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    linkedInUrl?: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    facebookUrl?: string;

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

    @Column({ type: 'timestamp', nullable: true })
    hotExpiredAt?: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => User, (user) => user.company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => Province, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'provinceId' })
    province?: Province;

    @OneToMany(() => JobPost, (jobpost) => jobpost.company)
    job!: JobPost[];

    @OneToMany(() => JobPost, jobPost => jobPost.company)
    jobPosts?: JobPost[];

    @OneToMany(() => FollowedCompany, companyFollowed => companyFollowed.company)
    followedCompanies!: FollowedCompany[];

    @OneToMany(() => CompanyImage, (companyImage) => companyImage.company)
    companyImages!: CompanyImage[];

    @OneToMany(() => PackageUsage, (usage) => usage.company)
    packageUsages!: PackageUsage[];

    @OneToMany(() => SavedResume, savedResume => savedResume.company)
    savedResumes!: SavedResume[];
} 