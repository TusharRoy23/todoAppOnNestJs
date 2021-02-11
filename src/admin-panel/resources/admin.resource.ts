import { ResourceWithOptions } from "admin-bro";
import { Admin } from "../entity/admin.entity";
// import * as bcrypt from "bcrypt"
import * as PasswordHooks from '../actions/password.hook';

const adminNavigation = {
    name: 'Admin User',
    icon: 'Accessibility'
};

const AdminResource: ResourceWithOptions = {
    resource: Admin,
    options: {
        navigation: adminNavigation,
        properties: {
            encryptedPassword: {
                isVisible: false
            },
            password: {
                type: 'password',
                isVisible: {
                    list: false, edit: true, filter: false, show: false
                }
            }
        },
        actions: {
            new: {
                before: PasswordHooks.passwordBeforeHook
            }
        }
    }
}

export default AdminResource;
