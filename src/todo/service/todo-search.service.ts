import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Todo } from "../entity/todo.entity";
import { TodoSearchResult } from '../types/todoSearchResult.interface';
import { TodoSearchBody } from '../types/todoSearchBody.interface';

@Injectable()
export class TodoSearchService {
    index = 'todos';

    constructor(
        private readonly elasticSearchService: ElasticsearchService
    ) {}

    async indexTodo(todo: Todo, userEmail: string) {
        return await this.elasticSearchService.index<TodoSearchResult, TodoSearchBody>({
            index: this.index,
            body: {
                id: todo.id,
                userEmail: userEmail,
                todo: {
                    title: todo.title,
                    description: todo.description,
                    createdDate: todo.createdDate,
                    updatedDate: todo.updatedDate
                }
            }
        }).then(response => {
            return response;
        }).catch(error => {
            throw new InternalServerErrorException('Elasticsearch Error');
        });
    }

    async search(text: string, email: string) {
        return await this.elasticSearchService.search<TodoSearchResult>({
            index: this.index,
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    "userEmail.keyword": {
                                        "value": email
                                    }
                                }
                            }
                        ],
                        should: [
                            {
                                multi_match: {
                                    query: text,
                                    fields: ["todo.title", "todo.description"]
                                }
                            }
                        ],
                        minimum_should_match: 1
                    }
                },
            }
        })
        .then((response) => {
            const hits = response.body.hits.hits;
            return hits.map(item => item._source);
        })
        .catch((error) => {
            throw new InternalServerErrorException('Elasticsearch Error');
        });
    }

    async remove(todoId: number) {
        this.elasticSearchService.deleteByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: todoId
                    }
                }
            }
        });
    }

    async update(todo: Todo, userEmail: string) {
        const newBody = {
            id: todo.id,
            userEmail,
            todo: {
                title: todo.title,
                description: todo.description,
                createdDate: todo.createdDate,
                updatedDate: todo.updatedDate
            }
        }

        const script = Object.entries(newBody).reduce((result, [key, value]) => {
            if (typeof(value) === 'object') {
                return `${result} ctx._source.todo=["title": '${value.title}', "description": '${value.description}', "createdDate": '${value.createdDate.toISOString()}', "updatedDate": '${value.updatedDate.toISOString()}'];`;
            }
            if (key === 'id') {
                return `${result} ctx._source['id']=${value};`;
            }
            return `${result} ctx._source['${key}']='${value}';`;
        }, '');
        
        return await this.elasticSearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: todo.id,
                    }
                },
                script: {
                    source: script
                },
            }
        })
        .then((response) => {
            return response;
        })
        .catch(error => {
            throw new InternalServerErrorException('Elasticsearch Error');
        })
    }
}