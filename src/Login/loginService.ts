import { EntityManager, InsertResult } from "typeorm";
import { AppDataSource } from "../data-source";
import { Members } from "../entity/members";
import { injectable } from "inversify";
import { NextFunction, Response } from "express";
import { Request } from "tsoa";
import bcrypt from 'bcrypt';
@injectable()
export class LoginService {
    private manager: EntityManager;
    private saltRounds = 10;
    constructor() {
        this.manager = AppDataSource.manager;
    }
 
    public async getMembers(): Promise<Members[]> {
        const result = await this.manager.getRepository(Members).find();
        return result;
    }

    public async saveNewMember(saveBody:object): Promise<InsertResult> {
        return await this.manager.getRepository(Members).insert(saveBody);
    }

    public async hashPassword(plainPassword: string): Promise<string> {
        try {
            const hashedPassword = await bcrypt.hash(plainPassword, this.saltRounds);
            return hashedPassword;
        } catch (error) {
            throw new Error('Error hashing password');
        }
    }


    public async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
            return isMatch;
        } catch (error) {
            throw new Error('Error comparing password');
        }
    }
}

export type AuthPostInterface = Omit<Members,"id"|"permissions">