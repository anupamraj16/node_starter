// an abstract class is choosen over an interface to avoid multiple if checks in error handling middleware
// an abstract class will stay in JS world, while an interface will fall away while executing the code
export abstract class CustomError extends Error {
  abstract statusCode: number
  constructor(message: string) {
    super(message)
    // only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): { message: string; field?: string }[]
}
