import mongoose from 'mongoose'
import { PasswordManager } from '../services/password'

// TypeScript and mongoose does not go hand in hand
// and that is why we have to change the way we create a new User
// instead of calling new User, we will use static build method which is type aware

// an interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string
  password: string
}

// an interface that describes the properties
// that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// an interface that describes the properties
// that a User document has
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
