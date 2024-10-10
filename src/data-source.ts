import "reflect-metadata"
import { DataSource } from "typeorm"
import { Members } from "./entity/members"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "docker",
    password: "docker",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Members],
    migrations: [],
    subscribers: [],
})
