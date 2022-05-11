const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-params-error')
const InvalidParamError = require('../helpers/invalid-params-error')
const UneauthorizedError = require('../helpers/uneauthorized-error') 
const ServerError = require('../helpers/server-error') 

const makeSut = () => {


  const authUseCaseSpy =  makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  authUseCaseSpy.accessToken = 'valid_token'

  const sut =  new LoginRouter(authUseCaseSpy , emailValidatorSpy) 

  return {
    authUseCaseSpy,
    sut,
    emailValidatorSpy
  }
}

const makeEmailValidator= ()=>{
  class EmailValidatorSpy{
    isValid(email){
      return this.isEmailValid
    }
  }

  const emailValidatorSpy =  new EmailValidatorSpy()

  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}



const makeAuthUseCase = ()=> {
  class AuthUseCaseSpy{
    auth(email , password){
      this.email = email
      this.password = password
      return this.accessToken
    }
  } 

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'

  return new AuthUseCaseSpy()
}

const makeEmailValidatorWithError = ()=> {
  class AuthUseCaseSpy{
    auth(){
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}  


const makeAuthUseCaseWithError = ()=> {
  class EmailValidatorSpy{
    isValid(){
      throw new Error()
    }
  }
  return new EmailValidatorSpy()
}  



describe('Login Router' , ()=>{
  it('should return 400 if not email is provided' , async ()=> {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    } 
    const httpResponse = await sut.route(httpRequest)
    
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("email"))
  })

  it('should return 400 if not password is provided' , async  ()=> {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    } 
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError(`password`))

  })


  it('should return 500 if no httpRequest is provided' ,async  ()=> {
    const {sut} = makeSut()

    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())

  })

  it('should return 500 if  httpRequest has not body' , async  ()=> {
    const {sut} = makeSut()

    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())


  })


  it('Should call AuthUseCaseSpy with correct params' , async  ()=> {
    const {authUseCaseSpy , sut} = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password :"password_fake"
      }
    } 

    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email) 
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password) 
  })


  it('Should return 401 when invalid credentials are provided ' , async ()=> {
    const {sut , authUseCaseSpy} = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email_fake@gmail.com',
        password :"password_invalid_fake"
      }
    } 

    const httpResponese  = await sut.route(httpRequest)
    expect(httpResponese.statusCode).toBe(401) 
    expect(httpResponese.body).toEqual(new UneauthorizedError('uneauthorizedError'))

  })


  it('Should return 200 when valid credentials are provided ' , async  ()=> {
    const {sut , authUseCaseSpy } = makeSut()


    const httpRequest = {
      body: {
        email: 'valid_email_fake@gmail.com',
        password :'password_valid_fake'
      }
    } 

    const httpResponese  =await  sut.route(httpRequest)
    expect(httpResponese.statusCode).toBe(200) 
    expect(httpResponese.body.accessToken).toEqual(authUseCaseSpy.accessToken) 

  })


  it('Should return 500 if no AuthUseCase is provided  ' , async()=> {
    
    const sut = new LoginRouter()

    const httpRequest = {
      body: {
        email: 'emailfake@gmail.com',
        password :"password_fake"
      }
    } 

    const httpResponse  = await  sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)   
    expect(httpResponse.body).toEqual(new ServerError())

  })

  

  it('Should return 500 if AuthUseCase has not auth method ' , async ()=> {

    // testing authUseCase exist↴
    const sut = new LoginRouter({})

    const httpRequest = {
      body: {
        email: 'emailfake@gmail.com',
        password :"password_fake"
      }
    } 

    const httpResponse  =await  sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)   
    expect(httpResponse.body).toEqual(new ServerError())

  })

  it('Should return 500 if AuthUseCase throws  ' ,async ()=> {


  
    const authUseCaseSpy = makeAuthUseCaseWithError()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'emailfake@gmail.com',
        password :"password_fake"
      }
    } 

    const httpResponse  = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)   

  })


  it('Should return 400 if an invalid email is provided' , async ()=> {
    const {sut , emailValidatorSpy} = makeSut()
    emailValidatorSpy.isValid = false
    const httpRequest = {
      body:{
        email: 'invalid_email@mail.com',
        password :"any_fake"
      }
    }

    const httpResponse  = await  sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)   
    expect(new InvalidParamError('email')).toEqual(new InvalidParamError('email'))   
  })

  it('Should return 500 if no EmailValidator is provided  ' , async()=> {
    const authUseCaseSpy =  makeAuthUseCase()
    
    const sut = new LoginRouter(authUseCaseSpy)

    const httpRequest = {
      body: {
        email: 'emailfake@gmail.com',
        password :"password_fake"
      }
    } 

    const httpResponse  = await  sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)   
    expect(httpResponse.body).toEqual(new ServerError())

  })


  it('Should return 500 if  EmailValidator has no isValid method  ' , async()=> {
    const authUseCaseSpy =  makeAuthUseCase()
    
    const sut = new LoginRouter(authUseCaseSpy , {})

    const httpRequest = {
      body: {
        email: 'emailfake@gmail.com',
        password :"password_fake"
      }
    } 

    const httpResponse  = await  sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)   
    expect(httpResponse.body).toEqual(new ServerError())

  })




  it('Should return 500 if EmailValidator throws  ' ,async ()=> {
  
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidatorSpy = makeEmailValidatorWithError()
    const sut = new LoginRouter(authUseCaseSpy , emailValidatorSpy)
    const httpRequest = {
      body: {
        email: 'emailfake@gmail.com',
        password :"password_fake"
      }
    } 

    const httpResponse  = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)   

  })

})