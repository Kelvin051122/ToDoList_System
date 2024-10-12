import { app } from "./app";
import { AppDataSource } from "./data-source";

const port = process.env.PORT || 3000;

app.listen(port, () =>{
  AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  }); 
    console.log(`Example app listening at http://localhost:${port}`)
  }
);