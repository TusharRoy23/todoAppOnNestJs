import { EntityRepository, Repository } from "typeorm";
import { AdminDto } from "../dto/admin.dto";
import { Admin } from "../entity/admin.entity";
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {
    async adminUserRegistration(adminDto: AdminDto): Promise<{ message: string }> {
        const { email, password, role } = adminDto;
        console.log('adminDto repository: ', adminDto);

        const salt = await bcrypt.genSalt();

        const admin = new Admin();
        admin.email = email;
        admin.role = role;
        admin.encryptedPassword = await this.hashPassword(password, salt);

        try {
            await admin.save();
            return { message: 'Account successfully created !' }
        } catch (error) {
            if (error.code == '23505') {
                throw new ConflictException('User already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt)
    }
}