const HttpResponse = require('../helpers/httpResponse')
const MissingParamError = require('../helpers/missing-params-error')

module.exports = class LoginRouter{

  constructor(authUseCase){
    this.authUseCase = authUseCase
  }

  route(httpRequest){


    try{

      const {email , password } = httpRequest.body



      if(!email){
        return HttpResponse.badRequest(new MissingParamError('email'))
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
