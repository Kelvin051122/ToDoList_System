import { Get,Route,Tags,Post,Body,Path,Example,Delete,Middlewares,TsoaResponse,Res} from "tsoa";
import { provideSingleton } from "../utils/provideSingleton";
import { inject } from "inversify";
import { TodoService} from "./TodoService";
import { TodoLists } from "../entity/TodoList";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { Request, Response, NextFunction } from "express";
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userInfo?: { userName: string; password: string; permissions:string };
  }
}

const isLoginedMiddleware = (req: Request& { session: session.SessionData }, res: Response, next: NextFunction) => {
    if (!req.session.userInfo) {
        res.json({ "message": "未登入" });
        return
    }
    next();
};
const AdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 在這裡進行請求的驗證或處理
    if(req.session.userInfo.permissions!=="Admin")
        return res.json({"message":"You don't have permission"})
    next(); // 繼續到下一個中介軟體或路由處理
};

@Route("to-do-list")
@Tags("To-do-List")
@provideSingleton(TodoController)
export class TodoController{
    constructor(
        @inject(TodoService) private _db: TodoService,
    ) {}
    
    @Get('list')
    @Middlewares(isLoginedMiddleware)
    public async getTodoLists(){
        return {
            status: true,
            data: await this._db.getTodoLists(),
        }
    }

    @Example<TodoLists>({
        "to_do_id" : 4,
		"subject" : "下午茶哩wadwa",
		"reserved_time" : "2021-06-09 12:04",
		"modified_time" : "2021-06-09 12:04",
        "current_time"  : "2021-06-09 12:04",
		"brief" : "50嵐跟可不可 , 到底要哪個",
		"level" : 8,
		"author" : "老K",
		"content" : "50嵐外帶20杯 7折 , 可不可每zxczcxvcbdasdawadas , 可wadasdxzx心 , 有人要跳巢的嗎！？",
		"attachments" : ["null"]
    })
    @Get('detail/{TodoID}')
    @Middlewares(isLoginedMiddleware)
    public async getTodoByID(@Path() TodoID: number, @Res() notFoundResponse: TsoaResponse<404, { message: "找不到對應ToDo" }>){
        const data = await this._db.getTodoLists()
        const ida = data.map(e=>e.to_do_id)
        if(!ida.includes(TodoID))
            return notFoundResponse(404, {message:"找不到對應ToDo"});
        return await this._db.getTodoByID(TodoID)
    }
    
    /**
     * @summary 需權限. 
     * @param requestBody Description for the request body object
     * @example requestBody {
     *   "subject" : "唷唷",
     *   "reserved_time" : "2024-08-15 00:55",
     *   "brief" : "wdadsd",
     *   "level" : 9,
     *   "author" : "阿麟",
     *   "content" : "dewfwewewf",
     *   "isFinished":"false",
     *   "attachments" : ["null"]
     * }
     * @example requestBody {
     *   "subject" : "下午茶哩",
     *   "reserved_time" : "2021-06-09 12:04",
     *   "brief" : "50嵐跟可不可 , 到底要哪個",
     *   "level" : 8,
     *   "author" : "老K",
     *   "isFinished":"false",
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
    @Middlewares([isLoginedMiddleware, AdminMiddleware])
    public async AddTodo(@Body() requestBody:TodoLists,@Path() TodoID: number): Promise<any>{
        const data = await this._db.getTodoLists()
        const ida = data.map(e=>e.to_do_id)
        if(!ida.includes(TodoID))
            return await this._db.AddTodo(requestBody)
        return await this._db.UpdateTodo(TodoID,requestBody)
    }
    /**
     * @summary 需權限.
     */
    @Delete('detail/{TodoID}')
    @Middlewares([isLoginedMiddleware, AdminMiddleware])
    public async deleteTodo(@Path() TodoID: number): Promise<DeleteResult>{
        return await this._db.deleteTodo(TodoID)
    }
    /**
     * @summary 需權限.
     */
    @Get('the-newest-id')
    @Middlewares([isLoginedMiddleware, AdminMiddleware])
    public async getNewestID():Promise<number>{
        return await this._db.getNewestID()
    }
}