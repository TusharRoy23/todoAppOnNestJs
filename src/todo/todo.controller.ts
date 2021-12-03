import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthenticationGuard } from "src/guards/jwt-authentication.guard";
import { GetUser } from "../auth/decorator/get-user.decorator";
import { User } from "../auth/entity/user.entity";
import { TodoDto } from "./dto/todo.dto";
import { Todo } from "./entity/todo.entity";
import { TodoPayload } from "./interface/todo-payload.interface";
import { TodoService } from "./service/todo.service";

@ApiTags('Todo')
@ApiBearerAuth()
@Controller('todo')
@UseGuards(JwtAuthenticationGuard)

export class TodoController {
    constructor(
        private todoService: TodoService
    ) {}

    @Get()
    getAllTodo(
        @GetUser() user: User,
    ): Promise<TodoPayload[]> {
        return this.todoService.getAllTodo(user);
    }

    @Get('/search-todo')
    searchTodo(
        @GetUser() user: User,
        @Query('search') search: string
    ) {
        if (search) {
            return this.todoService.searchForTodos(search, user);
        }
        return [];
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTodo(
        @Body() todoDto: TodoDto,
        @GetUser() user: User
    ): Promise<TodoPayload> {
        return this.todoService.createTodo(todoDto, user)
    }

    @Get('/:id')
    getTodoById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Todo> {
        return this.todoService.getTodoById(id, user)
    }

    @Patch('/:id')
    updateTodoById(
        @Param('id', ParseIntPipe) id: number,
        @Body() todoDto: TodoDto,
        @GetUser() user: User
    ): Promise<TodoPayload>{
        return this.todoService.updateTodoById(id, todoDto, user)
    }

    @Delete('/:id')
    deleteTodoById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<{ message: string }>{
        return this.todoService.deleteTodoById(id, user)
    }
}