class LoginRouter{
  route(httpRequest){
    if(!httpRequest.body.email || !httpRequest.body.password){
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
})