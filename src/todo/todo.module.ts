import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TodoRepository } from './repository/todo.repository';
import { TodoService } from './service/todo.service';
import { TodoController } from './todo.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([TodoRepository])
    ],
    controllers: [TodoController],
    providers: [TodoService]
})
export class TodoModule {}
