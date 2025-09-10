import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { Company } from './company'; 
import { Candidate } from './candidate';
  
  @Entity('company_followeds')
  export class CompanyFollowed {
  
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    companyId!:number;

    @Column()
    userId!:number;
    
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Company, (company) => company.followedCompanies,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'companyId' })
    company!: Company;
  
    @ManyToOne(() => Candidate, (candidate) => candidate.followedCompanies,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'candidateId' })
    candidate!: Candidate;
  }
  