const MissingParamError = require('./missing-params-error')
const UneauthorizedError = require('./uneauthorized-error') 
module.exports = 
class HttpResponse{
  static badRequest(paramName){
    return {
      statusCode:400,
      body : new  MissingParamError(paramName)
    }
  }
  static serverError(){
    return {
      statusCode:500
    }
  }

  static uneauthorizedError(){
    return {
      statusCode:401,
      body:  new UneauthorizedError()
    }
  }
}
