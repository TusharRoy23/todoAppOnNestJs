import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { UserInfoDto } from "../dto/user-info.dto";
import { UserInfo } from "../entity/user-info.entity";
import { UserService } from "./user.service";

const userValue: Partial<UserInfo> = {
    id: 25,
    petName: "Dog",
    photo: "image (1).png",
    modified_photo: "a1e74f4d-ad7f-4e92-b6c0-026cb10b633a.png",
    address: "Tangail",
  };

const userInfo: UserInfo = {
    id: 25,
    petName: "",
    photo: "",
    modified_photo: "",
    address: "",
} as UserInfo;
const user: Partial<User> = {
    id: 25,
    user_info: userInfo,
};
const userInfoDto: UserInfoDto = {
    petName: "",
    photo: "",
    modified_photo: "",
    address: ""
}


describe('UserService', () => {
    let userService: UserService;
    // const mockUserInfoRepo = {
    //     findOne: () => Promise.resolve(userValue),
    //     save: () => Promise.resolve(),
    // };
    const mockUserInfoRepo = {
        findOne: jest.fn(() => Promise.resolve(userValue)),
        save: jest.fn(() => Promise.resolve())
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserInfo),
                    useValue: mockUserInfoRepo
                }
            ]
        }).compile();
        userService = module.get<UserService>(UserService);
    });
    
    
    it('Can create a instance of UserService', () => {
        expect(userService).toBeDefined();
    });

    describe('User Information', () => {
        it('Get User Information', async () => {
            const test = await userService.getUser(user);
            expect(test).toEqual(userValue);
        });
    
        it('Get User Function Call', async () => {
            expect(mockUserInfoRepo.findOne).toHaveBeenCalledTimes(1);
        }); 

        it('Call With Value', async () => {
            const findOne = jest.spyOn(mockUserInfoRepo, 'findOne');
            expect(findOne).toHaveBeenCalledWith({ where : { id: 25 }});
        });
        
    });

    describe('Update User Information', () => {
        it('Do Update', async () => {
            const update = await userService.updateUserProfile(user, userInfoDto);
            expect(update).toEqual(userValue);
        });

        it('Call With Value', async () => {
            expect(mockUserInfoRepo.save).toHaveBeenCalledWith(userValue);
        });
        
    });

    it('Throw error while fetch user info', async (done) => {
        // mockUserInfoRepo.findOne = () => null; // temp mock
        mockUserInfoRepo.findOne = jest.fn(() => null);
        try {
            await userService.getUser(user);
        } catch (error) {
            done();
        }
    });
    
    
    afterEach(() => jest.restoreAllMocks());
});