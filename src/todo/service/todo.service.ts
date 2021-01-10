import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../auth/entity/user.entity";
import { TodoDto } from "../dto/todo.dto";
import { Todo } from "../entity/todo.entity";
import { TodoRepository } from "../repository/todo.repository";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoRepository)
        private todoRepository: TodoRepository
    ) {}

    async getAllTodo(user: User): Promise<Todo[]>{
        return this.todoRepository.getAllTodo(user)
    }

    async createTodo(
        todoDto: TodoDto,
        user: User
    ): Promise<Todo> {
        console.log('todoService: ', this.todoRepository)
        return this.todoRepository.createTodo(todoDto, user)
    }

    async getTodoById(
        id: number,
        user: User
    ): Promise<Todo> {
        const todo = await this.todoRepository.findOne({ where: { id, userId: user.id } })

        if (!todo) {
            throw new NotFoundException(`This ${id} is not found`);
        }
        return todo
    }

    async updateTodoById(id: number, todoDto: TodoDto, user: User) {
        const todo = await this.getTodoById(id, user)
        todo.title = todoDto.title
        todo.description = todoDto.description

        await todo.save()
        return todo
    }

    async deleteTodoById(id: number, user: User): Promise<void> {
        const todo = await this.todoRepository.delete({ id, userId: user.id })

        if (todo.affected === 0) {
            throw new NotFoundException(`This ${id} is not found`)
        }
    }
}