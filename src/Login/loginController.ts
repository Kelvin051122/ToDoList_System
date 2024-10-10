import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    Tags,
    SuccessResponse,
  } from "tsoa";
import { provideSingleton } from "../utils/provideSingleton";
import { inject } from "inversify";
import { LoginService } from "./loginService";

  @Tags("Auth")
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