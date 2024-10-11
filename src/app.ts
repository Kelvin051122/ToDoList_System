import express, { json, urlencoded, Response as ExResponse, Request as ExRequest, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import session from 'express-session';
declare module 'express-session' {
  interface SessionData {
    userInfo?: { userName: string; password: string };
  }
}
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis').default;
redisClient.connect().catch(console.error);

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());
app.use(session({
  store : new redisStore({client:redisClient}),
  secret : "c90dis90#" ,
  resave : true,
  saveUninitialized : false,
  name:"cookieAuth2",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,  // TTL set to 1 day
    httpOnly: true,  // Cookie accessible only by the server
    secure: false,  // Set to `true` if using https
  },
}))
app.use('/to-do-list', (req:ExRequest& { session: session.SessionData }, res:ExResponse, next: NextFunction):void => {
  if (!req.session.userInfo) {
    res.json({ "message": "未登入" });
  }
  next();
});
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse):Promise<void> => {
    res.send(
      swaggerUi.generateHTML(await import("../build/swagger.json"))
    );
  });
RegisterRoutes(app);