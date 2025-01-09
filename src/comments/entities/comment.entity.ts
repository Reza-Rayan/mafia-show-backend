import { Article } from "src/articles/entities/article.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    author: string;

    @Column()
    description: string;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @ManyToOne(() => Article, (article) => article.comments)
    article: Article;

    // New status column
    @Column({
        type: 'enum',
        enum: ['Pending', 'Accept', 'Denied'],
        default: 'Pending',
    })
    status: 'Pending' | 'Accept' | 'Denied';
}
