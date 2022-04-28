module.exports = class UneauthorizedError extends Error {
  constructor(paramName){
    super('UneauthorizedError')
    this.name = "MissingParamError"
  }
}