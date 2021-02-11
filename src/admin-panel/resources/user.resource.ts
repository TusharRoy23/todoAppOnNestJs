import { ResourceWithOptions } from "admin-bro";
import { User } from "src/auth/entity/user.entity";

const userNavigation = {
    name: 'User Information',
    icon: 'Accessibility'
};

const UserResource: ResourceWithOptions = {
    resource: User,
    options: {
        navigation: userNavigation,
        listProperties: [ 'id', 'username', 'userInfoId' ],
        properties: {
            password: {
                isVisible: { list: false, filter: false, show: false, edit: false }
            },
            salt: {
                isVisible: { list: false, filter: false, show: false, edit: false }
            },
            hashedRefreshToken: {
                isVisible: { list: false, filter: false, show: true, edit: false }
            }
        }
    },
}

export default UserResource;