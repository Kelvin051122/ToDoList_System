import { Get,Route,Tags,Post,Body,Path,Example,Delete } from "tsoa";
import { provideSingleton } from "../utils/provideSingleton";
import { inject } from "inversify";
import { TodoService,TodoPreview } from "./TodoService";
import { TodoLists } from "../entity/TodoList";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
@Route("to-do-list")
@Tags("To-do-List")
@provideSingleton(TodoController)
export class TodoController{
    constructor(
        @inject(TodoService) private _db: TodoService,
    ) {}
    
    @Get('list')
    public async getTodoLists(){
        return {
            status: true,
            data: await this._db.getTodoLists(),
        }
    }
    @Get('detail/{TodoID}')
    public async getTodoByID(@Path() TodoID: number){
        return await this._db.getTodoByID(TodoID)
    }
    /**
     * @param requestBody Description for the request body object
     * @example requestBody {
     *   "subject" : "唷唷",
     *   "reserved_time" : "2024-08-15 00:55",
     *   "modified_time" : "2024-08-17 00:35:40",
     *   "brief" : "wdadsd",
     *   "level" : 9,
     *   "author" : "阿麟",
     *   "content" : "dewfwewewf",
     *   "attachments" : ["null"]
     * }
     * @example requestBody {
     *   "subject" : "下午茶哩",
     *   "reserved_time" : "2021-06-09 12:04",
     *   "modified_time" : "2024-08-17 00:35:25",
     *   "brief" : "50嵐跟可不可 , 到底要哪個",
     *   "level" : 8,
     *   "author" : "老K",
     *   "content" : "50嵐外帶20杯 7折 , 可不可每zxczcxvcbdasdawadas , 可wadasdxzx心 , 有人要跳巢的嗎！？",
     *   "attachments" : ["null"]
     * }
     */
    @Example<UpdateResult>({
        "generatedMaps": [],
        "raw": [],
        "affected": 0
    })
    @Example<InsertResult>({
        "identifiers": [
            {
            "to_do_id": 0
            }
        ],
        "generatedMaps": [
            {
            "to_do_id": 0
            }
        ],
        "raw": [
            {
            "to_do_id": 0
            }
        ]
    })
    @Post('detail/{TodoID}')
    public async AddTodo(@Body() requestBody:TodoLists,@Path() TodoID: number): Promise<any>{
        const data = await this._db.getTodoByID(TodoID)
        if(!data[0])
            return await this._db.AddTodo(requestBody)
        return await this._db.UpdateTodo(TodoID,requestBody)
    }

    @Delete('detail/{TodoID}')
    public async deleteTodo(@Path() TodoID: number): Promise<DeleteResult>{
        return await this._db.deleteTodo(TodoID)
    }

    @Get('the-newest-id')
    public async getNewestID():Promise<number>{
        return await this._db.getNewestID()
    }
}