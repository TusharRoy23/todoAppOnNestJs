import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../auth/entity/user.entity";
import { TodoDto } from "../dto/todo.dto";
import { Todo } from "../entity/todo.entity";
import { TodoPayload } from "../interface/todo-payload.interface";
import { TodoRepository } from "../repository/todo.repository";
import { TodoSearchService } from "./todo-search.service";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoRepository)
        private todoRepository: TodoRepository,
        private todoSearchService: TodoSearchService
    ) {}

    async getAllTodo(user: Partial<User>): Promise<TodoPayload[]>{
        return this.todoRepository.getAllTodo(user)
    }

    async createTodo(
        todoDto: TodoDto,
        user: Partial<User>
    ): Promise<TodoPayload> {
        const newTodo = await this.todoRepository.createTodo(todoDto, user);
        this.todoSearchService.indexTodo(newTodo, user.username);
        return newTodo;
    }

    async getTodoById(
        id: number,
        user: Partial<User>
    ): Promise<Todo> {
        const todo = await this.todoRepository.findOne({ where: { id, userId: user.id } })

        if (!todo) {
            throw new NotFoundException(`This ${id} is not found`);
        }
        return todo
    }

    async updateTodoById(id: number, todoDto: TodoDto, user: Partial<User>): Promise<TodoPayload> {
        const todo = await this.getTodoById(id, user);
        try {
            todo.title = todoDto.title
            todo.description = todoDto.description
            todo.updatedDate = new Date();

            const updated = await this.todoRepository.updateTodo(todo);
            if (updated) {
                await this.todoSearchService.update(todo, user.username);
                return {
                    id: todo.id,
                    title: todo.title,
                    description: todo.description,
                    createdDate: todo.createdDate,
                    updatedDate: todo.updatedDate
                } 
            }
        } catch (error) {
            throw new NotFoundException(todo.id);
        }
    }

    async deleteTodoById(id: number, user: Partial<User>): Promise<{ message: string }> {
        const todo = await this.todoRepository.delete({ id, userId: user.id })

        if (todo.affected === 0) {
            throw new NotFoundException(`This ${id} is not found`)
        }
        await this.todoSearchService.remove(id);
        return { message: 'Deleted successfully !' }
    }

    async searchForTodos(text: string, user: Partial<User>) {
        const results = await this.todoSearchService.search(text, user.username);
        if (results) {
            return results;
        }
        return [];
    }
}