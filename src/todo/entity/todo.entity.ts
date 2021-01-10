import { User } from "../../auth/entity/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar"})
    title: string

    @Column()
    description: string

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date

    @CreateDateColumn({ type: 'timestamp' })
    updatedDate: Date

    @ManyToOne(type => User, user => user.todo, { eager: false })
    user: User

    @Column({ type: 'int' })
    userId: number
}