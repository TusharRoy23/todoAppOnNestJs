import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin-panel/admin.module';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import * as typeOrmConfig from './typeorm.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule, 
    TodoModule, 
    UserModule,
    AdminModule
  ]
})
export class AppModule {}
