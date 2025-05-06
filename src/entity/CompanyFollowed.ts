import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { Company } from './Company'; 
  import { User } from './User'; 
  
  @Entity('CompanyFolloweds')
  export class CompanyFollowed {
  
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    companyId!:number;

    @Column()
    userId!:number;
  
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;
  
    @ManyToOne(() => Company, (company) => company.followedCompanies,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'companyId' })
    company!: Company;
  
    @ManyToOne(() => User, (user) => user.followedCompanies,{onDelete:'CASCADE'})
    @JoinColumn({ name: 'userId' })
    user!: User;
  }
  