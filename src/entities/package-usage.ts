import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./company";
import { Package } from "./package";

@Entity('package_usages')
export class PackageUsage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageId!: number;

  @Column()
  companyId!: number;

  @Column({ type: "int" })
  candidateSearchUsed: number;

  @Column({ type: "int" })
  jobPostUsed: number;

  @Column({ type: 'int', default: 0 })
  jobHotDurationInDays: number;

  @Column({ type: 'int', default: 0 })
  highlightCompanyDurationInDays: number;

  @Column({ type: "timestamp", nullable: true })
  expiryDate?: Date;

  @ManyToOne(() => Package, { onDelete: "CASCADE" })
  @JoinColumn({ name: "packageId" })
  package!: Package;

  @ManyToOne(() => Company, (company) => company.packageUsages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "companyId" })
  company!: Company;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
