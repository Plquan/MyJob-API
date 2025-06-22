import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, BeforeRemove } from 'typeorm';
import { User } from './User';
import CloudinaryService from '../services/common/CloudinaryService';
import { Resume } from './Resume';

@Entity('MyJobFile')
export class MyJobFile {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  publicId!: string;

  @Column({ type: 'varchar', length: 255 })
  url!: string; 

  @Column({ type: 'varchar', length: 50 })
  fileType!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.avatar)
  user?: User

  @OneToOne(() => Resume, (resume) => resume.myJobFile)
  resume?: Resume

  @BeforeRemove()
  async deleteFromCloudinary() {
    if (this.publicId) {
       await CloudinaryService.deleteFile(this.publicId);
    }
  }

}
