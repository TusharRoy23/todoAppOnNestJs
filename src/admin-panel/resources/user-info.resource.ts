import { ResourceWithOptions } from "admin-bro";
import { UserInfo } from "src/user/entity/user-info.entity";

const userNavigation = {
    name: 'User Information',
    icon: 'Accessibility'
};

const UserInfoResource: ResourceWithOptions = {
    resource: UserInfo,
    options: {
        navigation: userNavigation,
        listProperties: [ 'id', 'petName', 'photo', 'address' ]
    }
}

export default UserInfoResource;