import { ResourceWithOptions } from "admin-bro";
import { Todo } from "src/todo/entity/todo.entity";

const todoNavigation = {
    name: 'Todo',
    icon: 'Accessibility'
};

const TodoResource: ResourceWithOptions = {
    resource: Todo,
    options: {
        navigation: todoNavigation,
        listProperties: [ 'id', 'title', 'description', 'createdDate', 'updatedDate', 'userId' ],
        properties: {
            id: {
                isVisible: { list: true, filter: true, show: true, edit: false }
            },
            title: {
                isVisible: { list: true, filter: true, show: true, edit: true }
            },
            description: {
                isVisible: { list: true, filter: true, show: true, edit: true },
                type: 'textarea'
            },
            createdDate: {
                isVisible: { list: true, filter: true, show: true, edit: true }
            },
            updatedDate: {
                isVisible: { list: true, filter: true, show: true, edit: true }
            },
            userId: {
                isVisible: { list: true, filter: true, show: true, edit: true }
            }
        }
    }
};

export default TodoResource;