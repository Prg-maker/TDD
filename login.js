// singup-router
const express = require("express");
const router = express.Router();

module.exports = () => {
  const router = new SingUpRouter()
  router.post("/singup",  ExpressRouterAdapter.adapt(router));
};
class ExpressRouterAdapter {
  static adapt(router){
    return async (req , res)=> {
      const httpRequest = {
        body: req.body,
      }
      const httpResponse = await router.route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

// presentation 

class SingUpRouter {
  async route(httpRequest)   {
    const { email, password, repeatPassword } = httpRequest.body;
    const user = new SingUpUseCase().singUp(email, password, repeatPassword);
    return {
      statusCode: 200,
      body: user
    }
  }
}

// domain
// sing-up - usecase
class SingUpUseCase {
  async singUp(email, password, repeatPassword) {
    if (password === repeatPassword) {
      new AddAccountRepository().create(email, password)
    }
  }
}

// infra
// add-acount-repo
const { PrismaClient } = require("@prisma/client");
const { route } = require("express/lib/application");

const prismaClient = new PrismaClient();

class AddAccountRepository {
  async create(email, password, repeatPassword) {
    const user = await prismaClient.user.create({
      data: {
        email,
        password,
      },
    });

    return user;
  }
}