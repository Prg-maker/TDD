const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-params-error')

const makeSut = () => {
  class AuthUseCaseSpy{
    auth(email , password){
      this.email = email
      this.password = password
    }
  } 

  const authUseCaseSpy = new AuthUseCaseSpy()
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

})