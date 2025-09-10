import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { Company } from './company';
import { MyJobFile } from './myjob-file';

@Entity('company_files')
export class CompanyFile {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    companyId!: number;

    @Column()
    imageId!: number;

    @ManyToOne(() => Company, (company) => company.files, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    company!: Company;

    @ManyToOne(() => MyJobFile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'myJobFileId' })
    images!: MyJobFile;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
