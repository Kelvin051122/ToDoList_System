import { EventEmitter } from "stream";
import { app } from "./app";
import { AppDataSource } from "./data-source";
import { TodoLists } from "./entity/TodoList";
const port = process.env.PORT || 3000;


const server = app.listen(port, () =>{
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

var WebSocketServer = require('websocket').server;

export var wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
  console.log(request)
  
  var connection = request.accept(null, request.origin)
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', async(message)=>{
    try{
        if (message.type === 'utf8') {
            if(message.utf8Data=="done"){
              await AppDataSource.manager.getRepository(TodoLists).update({isFinished:"notifying"}, { isFinished: "done" });
              await connection.sendUTF("Hello from node.js");
            }
            
            var payload = await AppDataSource.manager.getRepository(TodoLists).findBy({isFinished:"notifying"})//detecting notify data
            var payloadData = payload[0]
            
            if(payloadData){
              // 把 payload 轉換為 JSON 字符串並轉換為二進制數據
              var binaryPayload = Buffer.from(JSON.stringify(payload));
              await connection.sendBytes(binaryPayload);  // 發送二進制數據
              return;
            }
            else{
              await connection.sendUTF("Hello from node.js");
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
      }
      catch(err){console.log(err)}
  });



  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.'+reasonCode+description);
  });
});
    
  