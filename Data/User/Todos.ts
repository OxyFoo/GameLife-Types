export interface Todo {
    /** @description Time in seconds or 0 if unchecked */
    checked: number;

    /** @description Todo title with max 128 characters */
    title: string;

    /** @description Todo description with max 2048 characters */
    description: string;

    /** @description Timestamp in seconds */
    created: number;

    /** @description Timestamp in seconds, 0 if disabled */
    deadline: number;

    /** @description Tasks informations */
    tasks: Task[];
}

export interface TodoSaved extends Todo {
    ID: number;
}

export interface Task {
    checked: boolean;
    title: string;
}

export type SaveObject_Todos = {
    todos: TodoSaved[],
    additions: Todo[],
    editions: TodoSaved[],
    deletions: number[],
    sort: number[],
    sortSaved: boolean,
    token: number
};
