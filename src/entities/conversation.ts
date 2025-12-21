import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    JoinColumn,
    OneToMany,
    Index
} from "typeorm";
import { User } from "./user";
import { Message } from "./message";

@Entity('conversations')
@Index(['user1Id', 'user2Id'], { unique: true })
export class Conversation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    user1Id!: number;

    @Column()
    user2Id!: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    lastMessage?: string;

    @Column({ type: 'timestamp', nullable: true })
    lastMessageAt?: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user1Id' })
    user1!: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user2Id' })
    user2!: User;

    @OneToMany(() => Message, message => message.conversation)
    messages!: Message[];
}

