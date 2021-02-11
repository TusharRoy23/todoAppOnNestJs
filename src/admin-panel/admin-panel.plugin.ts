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
        resources: [
            UserResource,
            UserInfoResource,
            TodoResource,
            AdminResource
        ],
        // locale: {
        //     language: 'en',
        //     translations: {
        //         labels: {
        //             UserResource: 'User Credential'
        //         }
        //     }
        // },
    });

    const router = AdminBroExpress.buildRouter(adminBro);
    // const router = AdminBroExpress.b
    app.use(adminBro.options.rootPath, router);
}