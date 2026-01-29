export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    due_date: string;
    status: TaskStatus;
    created_at: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    due_date: string;
    status: TaskStatus;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    due_date?: string;
    status?: TaskStatus;
}
