import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminSignUpDto } from "./dto/admin-signup.dto";
import { AdminService } from "./service/admin.service";

@ApiTags('Admin')
@Controller('admin-auth')
export class AdminController {
    constructor(
        private adminService: AdminService
    ) {}

    @Post('/signup')
    adminUserRegistration(
        @Body(ValidationPipe) adminSignUpDto: AdminSignUpDto
    ): Promise<{ message: string }>  {
        return this.adminService.adminUserRegistration(adminSignUpDto);
    }
}