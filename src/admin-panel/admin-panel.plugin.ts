import { INestApplication } from "@nestjs/common";
import { Database, Resource } from '@admin-bro/typeorm';
import AdminBro from "admin-bro";
import * as AdminBroExpress from 'admin-bro-expressjs';
import { validate } from 'class-validator'
import UserResource from "./resources/user.resource";
import UserInfoResource from "./resources/user-info.resource";
import TodoResource from "./resources/todo.resource";
import AdminResource from "./resources/admin.resource";

export async function setupAdminPanel(app: INestApplication): Promise<void> {
    Resource.validate = validate;
    AdminBro.registerAdapter({ Database, Resource });

    const adminBro = new AdminBro({
        rootPath: '/admin',  // Define path for the admin panel
        loginPath: '/admin/login',
        resources: [
            UserResource,
            UserInfoResource,
            TodoResource,
            AdminResource
        ],
        branding: {
            companyName: 'Todo App',
            softwareBrothers: false
        }
    });

    const router = AdminBroExpress.buildRouter(adminBro);
    app.use(adminBro.options.rootPath, router);
}