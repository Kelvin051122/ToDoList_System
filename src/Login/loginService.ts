import { EntityManager } from "typeorm";
import { AppDataSource } from "../data-source";
import { Members } from "../entity/members";
import { injectable } from "inversify";
import { NextFunction, Response } from "express";
import { Request } from "tsoa";
@injectable()
export class LoginService {
    private manager: EntityManager;
 
    constructor() {
        this.manager = AppDataSource.manager;
    }
 
    public async getMembers(): Promise<Members[]> {
        const result = await this.manager.getRepository(Members).find();
        return result;
    }

    
}

export type AuthPostInterface = Omit<Members,"id"|"permissions">