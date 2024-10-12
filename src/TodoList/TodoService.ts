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
        return await this.manager.getRepository(TodoLists).find();
    }

    public async getTodoByID(TodoID:number): Promise<TodoLists[]> {
        return await this.manager.getRepository(TodoLists).findBy({to_do_id:TodoID});
    }

    public async AddTodo(requstBody:TodoLists): Promise<InsertResult> {
        const date = new Date();
        requstBody.modified_time = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
        return await this.manager.getRepository(TodoLists).insert(requstBody);
    }

    public async UpdateTodo(TodoID:number,requstBody:TodoLists): Promise<UpdateResult> {
        const todo =  await this.manager.getRepository(TodoLists).findBy({to_do_id:TodoID});
        const date = new Date();
        requstBody.modified_time = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
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

