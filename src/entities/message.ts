import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    JoinColumn,
    Index
} from "typeorm";
import { Conversation } from "./conversation";
import { User } from "./user";

@Entity('messages')
@Index(['conversationId', 'createdAt'])
@Index(['senderId'])
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    conversationId!: number;

    @Column()
    senderId!: number;

    @Column({ type: 'text' })
    content!: string;

    @Column({ type: 'boolean', default: false })
    isRead!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Conversation, conversation => conversation.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'conversationId' })
    conversation!: Conversation;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'senderId' })
    sender!: User;
}

