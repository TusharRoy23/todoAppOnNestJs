import { InternalServerErrorException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "src/auth/entity/user.entity";
import { TodoDto } from "../dto/todo.dto";
import { Todo } from "../entity/todo.entity";
import { TodoPayload } from "../interface/todo-payload.interface";
import { TodoRepository } from "../repository/todo.repository";
import { TodoSearchService } from "./todo-search.service";
import { TodoService } from "./todo.service";

const user: Partial<User> = {
    id: 25,
};

const todo: Partial<Todo> = {
    title: '',
    description: ''
};

const todoDto: TodoDto = {
    title: "",
    description: ""
};

const todoPayload: TodoPayload = {
    title: "",
    description: "",
    createdDate: undefined,
    updatedDate: undefined
};

const todos: TodoPayload[] = [todoPayload];

describe('Test Todo Service', () => {
    let todoService: TodoService;
    let todoRepository: TodoRepository;
    let fakeTodoSearchService: Partial<TodoSearchService>;
    const mockTodoRepo: Partial<TodoRepository> = {
        getAllTodo: jest.fn(() => Promise.resolve(todos)),
        createTodo: jest.fn(() => Promise.resolve(todo as Todo)),
        updateTodo: jest.fn(() => Promise.resolve(todo as Todo)),
        findOne: jest.fn(() => Promise.resolve(todo as Todo))
    };

    beforeEach(async () => {
        fakeTodoSearchService = {
            indexTodo: () => null,
            remove: () => null,
            update: () => null,
            search: () => null
        };
        const module = await Test.createTestingModule({
            providers: [
                TodoService,
                {
                    provide: TodoSearchService,
                    useValue: fakeTodoSearchService
                },
                {
                    provide: TodoRepository,
                    useValue: mockTodoRepo
                }
            ]
        }).compile();

        todoService = module.get<TodoService>(TodoService);
        todoRepository = module.get<TodoRepository>(TodoRepository);
    });

    afterEach(() => jest.restoreAllMocks());
    
    it('Instance of TodoService', () => {
        expect(todoService).toBeDefined();
    });

    describe('Call getAllTodo method', () => {
        it('Called with value', async () => {
            const test = await todoService.getAllTodo(user);
            expect(test).toEqual(todos);
        });

        it('Try with mockImplementation', async () => {
            const test = jest.spyOn(todoService, 'getAllTodo').mockImplementation((user) => Promise.resolve(todos));
            await todoService.getAllTodo(user);
            expect(test).toHaveBeenCalledTimes(1);
        });

        it('InternalServerErrorException', async () => {
            mockTodoRepo.getAllTodo = jest.fn(() => Promise.reject(new InternalServerErrorException()));
            await expect(todoService.getAllTodo(user)).rejects.toEqual(
                new InternalServerErrorException(),
            );
        });
        
    });

    describe('createTodo method', () => {
        it('Called with value (with spyOn)', async () => {
            jest.spyOn(todoService, 'createTodo').mockImplementation(() => Promise.resolve(todoPayload));
            const test = await todoService.createTodo(todoDto, user);
            expect(test).toEqual(todoPayload);
        });
        
        it('Called with value', async () => {
            const test = await todoService.createTodo(todoDto, user);
            expect(test).toEqual(todoPayload);
        });
    });

    describe('getTodoById method', () => {
        it('Test', async () => {
            const test = await todoService.getTodoById(todo.id, user);
            expect(test).toEqual(todo);
        });
        
    });

    it('getAllTodo Repo called one time', async () => {
        expect(mockTodoRepo.getAllTodo).toHaveBeenCalledTimes(1);
    });
});