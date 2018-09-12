import { ServiceError } from '../errors/service.js';

const ResponseHelpers = {
  analyzeAndParseResponse: (response, serviceName) => {
    if (response.ok) {
      return response.json();
    }
    throw Error(`Erro ao se conectar com o serviço ${serviceName}.`);
  },
  checkForViaCepError: (response, serviceName) => {
    if (response.erro === true) {
      throw new Error(`CEP não encontrado na base do ${serviceName}.`);
    }
    return response;
  },
  extractCepValuesFromResponse: (response, objectFields) => {
    return {
      cep: response[objectFields.cep].replace('-', ''),
      state: response[objectFields.state],
      city: response[objectFields.city],
      neighborhood: response[objectFields.neighborhood],
      street: response[objectFields.street],
    }
  },
  throwApplicationError: (error, serviceName) => {
    const serviceError = new ServiceError({
      message: error.message,
      service: serviceName.toLowerCase(),
    })
    if (error.name === 'FetchError') {
      serviceError.message = `Erro ao se conectar com o serviço ${serviceName}.`;
    }
    throw serviceError;
  }
}

export { ResponseHelpers };

export default ResponseHelpers;
