import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
  } from "tsoa";
import { provideSingleton } from "../utils/provideSingleton";
import { inject } from "inversify";
import { Members } from "../entity/members";
import { AppDataSource } from "../data-source";
import { LoginService } from "./loginService";
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  }); 
const MemberRepository = AppDataSource.getRepository(Members)
  @Route("auth")
  @provideSingleton(LoginController)
  export class LoginController{
    constructor(
        @inject(LoginService) private _db: LoginService,
    ) {
        
    }
    @Get()
    public async getMembers(){
      return {
        status: true,
        data: await this._db.getMembers(),
      }
    }

  }