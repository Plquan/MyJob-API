import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn, OneToMany } from 'typeorm';
import { User } from './user';
import { Resume } from './resume';
import { CompanyImage } from './company-image';

@Entity('myjob_files')
export class MyJobFile {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  publicId!: string;

  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @Column({ type: 'varchar', length: 50 })
  fileType!: string;

  @Column({ type: 'varchar', length: 20 })
  resourceType!: string;

  @Column({ type: 'varchar', length: 20 })
  format!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToOne(() => User, (user) => user.avatar)
  user?: User

  @OneToOne(() => Resume, (resume) => resume.myJobFile)
  resume?: Resume

  @OneToMany(() => CompanyImage, (companyImage) => companyImage.image)
  companyImages!: CompanyImage[];
}
