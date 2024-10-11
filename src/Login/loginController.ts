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
    Request,
    RequestProp,
  } from "tsoa";
import { provideSingleton } from "../utils/provideSingleton";
import { inject } from "inversify";
import { LoginService,AuthPostInterface } from "./loginService";
import { request } from "express";

  @Tags("Auth")
  @Route("auth")
  @provideSingleton(LoginController)
  export class LoginController{
    constructor(
        @inject(LoginService) private _db: LoginService,
    ) {
        
    }
    @Post()
    public async authPOST(@Body() requestBody:AuthPostInterface, @Request() request: any):Promise<any>{
      const userName = (await this._db.getMembers()).filter(e=>e.userName===requestBody.userName)[0]
      if(!userName)
        return {"message":"user doesn't exist"}
      const password = userName.password
      if(requestBody.password!==password)
        return{"message":"password incorrect"}
      request.session.userInfo = {isLogined:true}
      return{"message":"Login successful"}
    }

  }

  @Tags("logout")
  @Route("logout")
  @provideSingleton(LogoutController)
  export class LogoutController{
    constructor(
        @inject(LoginService) private _db: LoginService,
    ) {
        
    }
    @Get()
    public async Logout(@Request() request: any):Promise<any>{
      request.session.destroy();
      return{message:"Logout successful"}
    }

  }