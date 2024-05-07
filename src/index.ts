import mongoose from "mongoose"

import { app } from './app'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Server connected to MongoDb...')

      app.listen(3000, () => {
        console.log('Server listening at port 3000....')
      })
    })
    .catch(() => console.log('MongoDB container is not up and running, run "docker-compose up"'))
}

start()
