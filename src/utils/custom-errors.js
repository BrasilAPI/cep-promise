module.exports = class AggregateError extends Error {
  constructor (errors) {
    super('Aggregate error object, access errors via this.errors')
    this.stack = (new Error()).stack;
    this.name = this.constructor.name
    this.errors = errors
  }
};
