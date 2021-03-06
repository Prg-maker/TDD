const HttpResponse = require('../helpers/httpResponse')
const MissingParamError = require('../helpers/missing-params-error')
const InvalidParamError = require('../helpers/invalid-params-error')

module.exports = class LoginRouter{

  constructor(authUseCase  , emailValidator){
    this.authUseCase = authUseCase,
    this.emailValidator = emailValidator
  }

  async route(httpRequest){


    try{

      const {email , password } = httpRequest.body



      if(!email){
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

    
  
      if(!this.emailValidator.isValid(email)){
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      
  
      if(!password){
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
  
      const accessToken =  this.authUseCase.auth(email , password)
  
      if(!accessToken){
        return HttpResponse.uneauthorizedError()
      }
      return HttpResponse.ok({accessToken})
    }catch(err){
      return HttpResponse.serverError()
    }

  }
}
