import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId, Unique } from "typeorm";
import * as bcrypt from "bcrypt"
import { Todo } from "../../todo/entity/todo.entity";
import { UserInfo } from "../../user/entity/user-info.entity";
import { Exclude } from "class-transformer";

@Entity()
@Unique(['username'])

export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    username: string

    @Column({ type: "varchar" })
    password: string

    @Column()
    salt: string

    @Column({ nullable: true })
    @Exclude()
    public hashedRefreshToken?: string

    @OneToMany(type => Todo, todo => todo.user, { eager: true })
    todo: Todo[]

    @OneToOne(type => UserInfo, { eager: true })
    @JoinColumn()
    user_info: UserInfo

    @RelationId((user: User) => user.user_info)
    userInfoId: number

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword).then(result => result)
    }
}