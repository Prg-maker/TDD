class LoginRouter{
  route(httpRequest){


    if(!httpRequest || !httpRequest.body){
      return {
        statusCode: 500
      }
    }

    const {email , password } = httpRequest.body


    if(!email || !password){
      return {
        statusCode:400
      }
    }

  }
}

describe('Login Router' , ()=>{
  it('should return 400 if not email is provided' , ()=> {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    } 
    const httpResponse = sut.route(httpRequest)
    
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if not password is provided' , ()=> {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    } 
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })


  it('should return 500 if no httpRequest is provided' , ()=> {
    const sut = new LoginRouter()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)

  })

  it('should return 500 if  httpRequest has not body' , ()=> {
    const sut = new LoginRouter()

    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })
})