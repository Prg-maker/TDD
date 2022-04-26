class LoginRouter{
  route(httpRequest){
    if(!httpRequest.body.email){
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
})