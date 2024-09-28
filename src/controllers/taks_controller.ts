import { Task, TaskCreateRequest, TaskList } from "../schemas/task_schema";

const task1: Task = {
  id: "task1",
  title: "Task 1",
  description: "Task 1 description",
  dueDate: new Date("2025-12-31").toISOString(),
  priority: "High",
  isCompleted: false,
  isDeleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const task2: Task = {
  id: "task2",
  title: "Task 2",
  description: "Task 2 description",
  dueDate: new Date("2022-12-30").toISOString(),
  priority: "Medium",
  isCompleted: false,
  isDeleted: false,
  createdAt: new Date("2022-12-01").toISOString(),
  updatedAt: new Date("2022-12-02").toISOString(),
};

export class TaskController {
  async fetchAllTasks(): Promise<TaskList> {
    const dummyTasks: TaskList = [task1, task2];
    return dummyTasks;
  }

  async createTask(task: TaskCreateRequest): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newTask;
  }
  async fetchTask(taskId: string): Promise<Task> {
    // TODO: fetch task by taskId
    //...
    console.log(taskId);
    return task2;
  }
}
