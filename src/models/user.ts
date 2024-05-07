import mongoose from 'mongoose'
import { PasswordManager } from '../services/password'

// an interface that describes the properties
// that are required to create a new User
export interface UserAttrs {
  email: string
  password: string
}

const userSchema = new mongoose.Schema<UserAttrs>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    // massage the object to work with
    // different microservices and their different databases
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password
      delete ret.__v
    }
  }
})

// defining function with function keyword gives access to document being saved using this
// if arrow function is used, this will refer to the context of the file
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

const User = mongoose.model<UserAttrs>('User', userSchema)

export { User }
