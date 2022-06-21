import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { SignupCredentialsDto } from "../dto/signup-credentials.dto";
import { User } from "../entity/user.entity";
import { UserRepository } from "../repository/user.repository";
import { AuthService } from "./auth.service";

const signUpDto: SignupCredentialsDto = {
    username: "tushar34@gm.com",
    password: "Tushar24&"
}

describe('AuthService', () => {
    let authService: AuthService;
    let fakeJwtService: Partial<JwtService>;
    let userRepository: UserRepository;

    const mockUserRepository = {

    };

    beforeEach(async () => {
        fakeJwtService = {
            sign: (payload: any, value: any) => 'anyString',
        };
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: fakeJwtService,
                },
                UserRepository,
            ],
        }).compile();
        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<UserRepository>(UserRepository);
    });
    
    it('can create an instance of auth service', async () => {
        expect(authService).toBeDefined();
    });
    
    it('Create User', async () => {
        // const signUp = await userRepository.signUp(signUpDto);
        // expect(signUp).toEqual({});
        const user = new User();

        // const user: Partial<User> = {
        //     username: "tushar34@gm.com",
        //     password: "Tushar24&",
        //     salt: '456rrty',

        // };
        const saveSpy = await jest.spyOn(userRepository, 'save').mockResolvedValue(user as User);
        const signUp = await authService.signUp(signUpDto);
        expect(signUp).toEqual({});
        // expect(saveSpy).toHaveBeenCalledWith(user);
    });
    
});