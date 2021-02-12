import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from "bcrypt";

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

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword).then(result => result)
    }
}
