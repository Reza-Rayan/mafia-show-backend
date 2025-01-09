import { Comment } from "src/comments/entities/comment.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Article {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    image: string;

    @CreateDateColumn({ type: 'timestamp' })
    created: Date;

    @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

}
