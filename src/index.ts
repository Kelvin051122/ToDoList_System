import { AppDataSource } from "./data-source"
import { Members } from "./entity/members"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new Members()
    user.userName = "Timber"
    user.password = "Saw"
    user.permissions = "Admin"
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(Members)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
