import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../service/auth.service";
import { AuthController } from '../auth.controller';
import { JwtAuthenticationGuard } from "src/guards/jwt-authentication.guard"
import { JwtRefreshTokenGuard } from "src/guards/jwt-refresh-token.guard"

describe('Description', () => {
    let controller: AuthController;
    let jwtAuthGuard: JwtAuthenticationGuard;
    let jwtRefreshGuard: JwtRefreshTokenGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            // providers: [JwtAuthenticationGuard, JwtRefreshTokenGuard]
        })
        .compile();

        jwtAuthGuard = new JwtAuthenticationGuard();
        jwtRefreshGuard = new JwtRefreshTokenGuard();
        controller = module.get<AuthController>(AuthController);
    });
    
    it('should be defined', () => {
        expect(jwtAuthGuard).toBeDefined();
        expect(jwtRefreshGuard).toBeDefined();
        expect(controller).toBeDefined();
    });
    
});