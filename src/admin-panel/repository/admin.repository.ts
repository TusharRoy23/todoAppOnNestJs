import { EntityRepository, Repository } from "typeorm";
import { AdminSignUpDto } from "../dto/admin-signup.dto";
import { AdminSignInDto } from "../dto/admin-signin.dto";
import { Admin } from "../entity/admin.entity";
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {
    async adminUserRegistration(adminSignUpDto: AdminSignUpDto): Promise<{ message: string }> {
        const { email, password, role } = adminSignUpDto;
        console.log('adminSignUpDto repository: ', adminSignUpDto);

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

    async validateAdminUser(adminSignInDto: AdminSignInDto): Promise<{ email: string, role: string }> {
        const { email, password } = adminSignInDto;
        const auth = await this.findOne({ email });
        
        if (auth && await auth.validatePassword(password, auth.encryptedPassword)) {
            return {
                email: auth.email,
                role: auth.role
            }
        } else {
            return null
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt)
    }
}
