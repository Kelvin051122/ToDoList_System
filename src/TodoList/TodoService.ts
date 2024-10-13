import { DeleteResult, EntityManager, InsertResult, UpdateResult } from "typeorm";
import { AppDataSource } from "../data-source";
import { TodoLists } from "../entity/TodoList";
import { injectable } from "inversify";
setInterval(async () => {
    const todoRepository = AppDataSource.manager.getRepository(TodoLists);
    const date = new Date();
    const TaiwanDate = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0].split(':').slice(0, 2).join(':');
    // 更新 current_time 欄位
    await todoRepository.update({}, { current_time: TaiwanDate });

    const unfinishedData = await todoRepository.findBy({isFinished:"false",reserved_time:TaiwanDate})
    if(unfinishedData[0]){
        console.log('action')
        await todoRepository.update({reserved_time:TaiwanDate}, { isFinished: "notifying" });
    }
}, 500);
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
        return await this.manager.getRepository(TodoLists).insert(await this.update_modified_time(requstBody));
    }

    public async UpdateTodo(TodoID:number,requstBody:TodoLists): Promise<UpdateResult> {
        return await this.manager.getRepository(TodoLists).update({to_do_id:TodoID},await this.update_modified_time(requstBody));
    }

    public async deleteTodo(TodoID:number): Promise<DeleteResult> {
        return await this.manager.getRepository(TodoLists).delete({to_do_id:TodoID});
    }

    public async getNewestID(): Promise<number> {
        const data = await this.getTodoLists()
        const theNewestID = Number(data.map(e=>e.to_do_id).sort((a, b) => b - a)[0])+1
        return theNewestID;
    }

    public async update_modified_time(updateParam?:any){
        const date = new Date();
        updateParam.modified_time = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0].split(':').slice(0, 2).join(':');
        return updateParam
    }
}

