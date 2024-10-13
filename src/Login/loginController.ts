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
    Example
  } from "tsoa";
import { provideSingleton } from "../utils/provideSingleton";
import { inject } from "inversify";
import { LoginService,AuthPostInterface } from "./loginService";
import { request } from "express";

  @Tags("Login")
  @Route("login")
  @provideSingleton(LoginController)
  export class LoginController{
    constructor(
        @inject(LoginService) private _db: LoginService,
    ) {
        
    }
    @Example<object>({"message":"user doesn't exist"})
    @Example<object>({"message":"password incorrect"})
    @Example<object>({"message":"Login successful"})
    @Post()
    public async authPOST(@Body() requestBody:AuthPostInterface, @Request() request: any):Promise<any>{
      const userName = (await this._db.getMembers()).filter(e=>e.userName===requestBody.userName)[0]
      if(!userName)
        return {"message":"user doesn't exist"}

      const isPasswordCorrect = await this._db.comparePassword(requestBody.password, userName.password);

      if (!isPasswordCorrect) 
        return { "message": "Password incorrect" };
      
      // 登入成功，設置 session
      request.session.userInfo = {isLogined:true,permissions:userName.permissions}
      return { "message": "Login successful" };

    }

  }

  @Tags("Logout")
  @Route("logout")
  @provideSingleton(LogoutController)
  export class LogoutController{
    constructor(
        @inject(LoginService) private _db: LoginService,
    ) {
        
    }
    @Example<object>({message:"Logout successful"})
    @Get()
    public async Logout(@Request() request: any):Promise<any>{
      request.session.destroy();
      return{message:"Logout successful"}
    }

  }

  @Tags("Register")
  @Route("register")
  @provideSingleton(RegisterController)
  export class RegisterController{
    constructor(
        @inject(LoginService) private _db: LoginService,
    ) {
        
    }

    @Example<object>({ "message": "User already exists" })
    @Example<object>({ "message": "Registration successful" })
    @Post()
    public async register(@Body() requestBody: AuthPostInterface, @Request() request: any): Promise<any> {
        // 檢查使用者是否已經存在
        const userName = (await this._db.getMembers()).filter(e => e.userName === requestBody.userName)[0];
        if (userName) {
            return { "message": "User already exists" };
        }

        // 使用 bcrypt 加密密碼
        const hashedPassword = await this._db.hashPassword(requestBody.password);

        // 儲存使用者資料，包括加密後的密碼
        await this._db.saveNewMember({
            ...requestBody,
            password: hashedPassword,
            permissions:"Normal"
        });
        const userName2 = (await this._db.getMembers()).filter(e => e.userName === requestBody.userName)[0];
        request.session.userInfo = {isLogined:true,permissions:userName2.permissions}
        return { "message": "Registration successful" };
    }

  }