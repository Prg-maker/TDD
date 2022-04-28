const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-params-error')
const UneauthorizedError = require('../helpers/uneauthorized-error') 

const makeSut = () => {
  class AuthUseCaseSpy{
    auth(email , password){
      this.email = email
      this.password = password
      return this.accessToken
    }
  } 

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'

  const sut =  new LoginRouter(authUseCaseSpy)

  return {
    authUseCaseSpy,
    sut
  }
}



describe('Login Router' , ()=>{
  it('should return 400 if not email is provided' , ()=> {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    } 
    const httpResponse = sut.route(httpRequest)
    
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError(`email`))
  })

  it('should return 400 if not password is provided' , ()=> {
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    } 
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError(`password`))

  })


  it('should return 500 if no httpRequest is provided' , ()=> {
    const {sut} = makeSut()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)

  })

  it('should return 500 if  httpRequest has not body' , ()=> {
    const {sut} = makeSut()

    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })


  it('Should call AuthUseCaseSpy with correct params' , ()=> {
    const {authUseCaseSpy , sut} = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password :"password_fake"
      }
    } 

    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email) 
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password) 
  })


  it('Should return 401 when invalid credentials are provided ' , ()=> {
    const {sut , authUseCaseSpy} = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email_fake@gmail.com',
        password :"password_invalid_fake"
      }
    } 

    const httpResponese  = sut.route(httpRequest)
    expect(httpResponese.statusCode).toBe(401) 
    expect(httpResponese.body).toEqual(new UneauthorizedError('uneauthorizedError'))

  })


  it('Should return 200 when valid credentials are provided ' , ()=> {
    const {sut } = makeSut()


    const httpRequest = {
      body: {
        email: 'valid_email_fake@gmail.com',
        password :'password_valid_fake'
      }
    } 

    const httpResponese  = sut.route(httpRequest)
    expect(httpResponese.statusCode).toBe(200) 

  })


  it('Should return 500 if no AuthUseCase is provided  ' , ()=> {
    const sut = new LoginRouter()

    const httpRequest = {
      body: {
        email: 'emailfake@gmail.com',
        password :"password_fake"
      }
    } 

    const httpResponese  = sut.route(httpRequest)
    expect(httpResponese.statusCode).toBe(500)   

  })

  

  it('Should return 500 if AuthUseCase has not auth method ' , ()=> {

    // testing authUseCase exist↴
    const sut = new LoginRouter({})

    const httpRequest = {
      body: {
        email: 'emailfake@gmail.com',
        password :"password_fake"
      }
    } 

    const httpResponese  = sut.route(httpRequest)
    expect(httpResponese.statusCode).toBe(500)   

  })

 
})