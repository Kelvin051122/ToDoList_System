import { DeleteResult, EntityManager, InsertResult, UpdateResult } from "typeorm";
import { AppDataSource } from "../data-source";
import { TodoLists } from "../entity/TodoList";
import { injectable } from "inversify";
 
@injectable()
export class TodoService {
    private manager: EntityManager;
 
    constructor() {
        this.manager = AppDataSource.manager;
    }
 
    public async getTodoLists(): Promise<TodoLists[]> {
        const result = await this.manager.getRepository(TodoLists).find();
        return result;
    }

    public async getTodoByID(TodoID:number): Promise<TodoLists[]> {
        return await this.manager.getRepository(TodoLists).findBy({to_do_id:TodoID});
    }

    public async AddTodo(requstBody:TodoLists): Promise<InsertResult> {
        return await this.manager.getRepository(TodoLists).insert(requstBody);
    }

    public async UpdateTodo(TodoID:number,requstBody:TodoLists): Promise<UpdateResult> {
        return await this.manager.getRepository(TodoLists).update({to_do_id:TodoID},requstBody);
    }

    public async deleteTodo(TodoID:number): Promise<DeleteResult> {
        return await this.manager.getRepository(TodoLists).delete({to_do_id:TodoID});
    }

    public async getNewestID(): Promise<number> {
        const data = await this.getTodoLists()
        const theNewestID = Number(data.map(e=>e.to_do_id).sort((a, b) => b - a)[0])+1
        return theNewestID;
    }
}

export interface TodoPreview {
    subject: string;
    reserved_time: string;
    modified_time: string;
    brief: string;
    level: number;
    author: string;
    content: string;
    attachments: string[]; // attachments 應該是數組
}  