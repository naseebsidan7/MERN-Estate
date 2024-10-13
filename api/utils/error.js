export const errorHandler = (statusCode, message, res ) => {
     const error = new Error()
     error.statusCode = statusCode
     error.message = message

     return error
}