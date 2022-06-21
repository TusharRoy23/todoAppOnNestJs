import { User } from "../../auth/entity/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { TodoDto } from "../dto/todo.dto";
import { Todo } from "../entity/todo.entity";
import { TodoPayload } from "../interface/todo-payload.interface";
import { InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
    async createTodo(
        todoDto: TodoDto,
        user: Partial<User>
    ): Promise<Todo> {
        const { title, description } = todoDto

        const todo = new Todo()

        todo.title = title
        todo.description = description
        todo.user = user as User;

        await this.save(todo)
        console.log('todo: ', todo);

        delete todo.user
        return todo
    }

    async getAllTodo(user: Partial<User>): Promise<TodoPayload[]> {
        const query = this.createQueryBuilder('todo');

        try {
            query.where('todo.userId = :userId', { userId: user.id })

            const todos = await query.getMany()
            return todos
        } catch (error) {
            throw new InternalServerErrorException();
            
        }
    }

    async updateTodo(todo: Todo): Promise<Todo> {
        try {
            return await this.save(todo);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}