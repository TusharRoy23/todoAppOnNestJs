import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminSignInDto } from "../dto/admin-signin.dto";
import { AdminSignUpDto } from "../dto/admin-signup.dto";
import { AdminRepository } from "../repository/admin.repository";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminRepository)
        private adminRepository: AdminRepository
    ) {}

    async adminUserRegistration(adminSignUpDto: AdminSignUpDto): Promise<{ message: string }> {
        return this.adminRepository.adminUserRegistration(adminSignUpDto);
    }

    async adminUserLogin(adminSignInDto: AdminSignInDto): Promise<{ email: string, role: string }> {
        return this.adminRepository.validateAdminUser(adminSignInDto);
    }
}