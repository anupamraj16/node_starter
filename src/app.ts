import express from "express";
import cookieSession from "cookie-session";
// removes the need to pass err to next function in async middlewares
import 'express-async-errors'
import { json } from 'body-parser';

import { currentUserRouter, signinRouter, signoutRouter, signupRouter } from "./routes";
import { NotFoundError } from "./errors";
import { errorHandler } from "./middlewares";

const app = express()
app.set('trust proxy', true) // traffic is being proxied to our application through ingress-nginx
app.use(json())
app.use(cookieSession({
  signed: false, // no encryption needed, JWT is already encrypted
  // secure: process.env.NODE_ENV !== 'test',
  secure: false
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
