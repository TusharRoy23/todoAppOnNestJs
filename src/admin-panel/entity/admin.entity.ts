import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['email'])

export class Admin extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    email: string

    @Column({ type: "varchar" })
    encryptedPassword: string

    @Column({ type: "varchar", enum: ['admin', 'restricted'] })
    role: string
}
