import "reflect-metadata"
import { DataSource } from "typeorm"
import { Members } from "./entity/members"
import { TodoLists } from "./entity/TodoList"
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "docker",
    password: "docker",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Members,TodoLists],
    migrations: [],
    subscribers: [],
})
