import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminDto } from "../dto/admin.dto";
import { AdminRepository } from "../repository/admin.repository";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminRepository)
        private adminRepository: AdminRepository
    ) {}

    async adminUserRegistration(adminDto: AdminDto): Promise<{ message: string }> {
        return this.adminRepository.adminUserRegistration(adminDto);
    }
}