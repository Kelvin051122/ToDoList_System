import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";
import { LoginService as db } from "./Login/loginService";
import { TodoService as db2 } from "./TodoList/TodoService";
// Create a new container tsoa can use
const iocContainer = new Container();

decorate(injectable(), Controller); // Makes tsoa's Controller injectable

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());
iocContainer.bind<db>(db).to(db);
iocContainer.bind<db2>(db2).to(db2);
// export according to convention
export { iocContainer };