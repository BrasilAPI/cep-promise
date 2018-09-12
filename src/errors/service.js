class ServiceError extends Error {
  constructor({ message, service } = {}) {
    super();
    this.name = 'ServiceError';
    this.message = message;
    this.service = service;
  }
}

export { ServiceError };

export default ServiceError;
