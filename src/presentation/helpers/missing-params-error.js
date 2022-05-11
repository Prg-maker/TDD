module.exports = class MissingParamError extends Error {
  constructor(paramName){
    super(`missing param:${paramName} `)
    this.name = "MissingParamError"
  }
}