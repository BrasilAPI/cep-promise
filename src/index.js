'use strict'

import { CepPromiseError } from './errors/cep-promise.js';
import { CepAbertoService, CorreiosService, ViaCepService } from './services/index.js';
import { Promise } from './helpers/promise-any.js';
import { CEP_SIZE } from './helpers/consts';

const _helpers = {
  validateInputType: (cepRawValue) => {
    const cepTypeOf = typeof cepRawValue;
    if (cepTypeOf === 'number' || cepTypeOf === 'string') {
      return cepRawValue;
    }
    throw new CepPromiseError({
      message: 'Erro ao inicializar a instância do CepPromise.',
      type: 'validation_error',
      errors: [{
        message: 'Você deve chamar o construtor utilizando uma String ou um Number.',
        service: 'cep_validation'
      }]
    })
  },
  removeSpecialCharacters: (cepRawValue) => cepRawValue.toString().replace(/\D+/g, ''),
  leftPadWithZeros: (cepCleanValue) => '0'.repeat(CEP_SIZE - cepCleanValue.length) + cepCleanValue,
  validateInputLength: (cepWithLeftPad) => {
    if (cepWithLeftPad.length <= CEP_SIZE) {
      return cepWithLeftPad
    }
    throw new CepPromiseError({
      message: `CEP deve conter exatamente ${CEP_SIZE} caracteres.`,
      type: 'validation_error',
      errors: [{
        message: `CEP informado possui mais do que ${CEP_SIZE} caracteres.`,
        service: 'cep_validation'
      }]
    })
  },
  fetchCepFromServices: (cepWithLeftPad) => {
    return Promise.any([
      CepAbertoService(cepWithLeftPad),
      CorreiosService(cepWithLeftPad),
      ViaCepService(cepWithLeftPad),
    ])
  },
  handleServicesError: (aggregatedErrors) => {
    if (aggregatedErrors.length !== undefined) {
      throw new CepPromiseError({
        message: 'Todos os serviços de CEP retornaram erro.',
        type: 'service_error',
        errors: aggregatedErrors,
      })
    }
    throw aggregatedErrors;
  },
  throwApplicationError: ({ message, type, errors }) => new CepPromiseError({ message, type, errors }),
};

const searchCEP = (cepRawValue) => {
  return Promise.resolve(cepRawValue)
    .then(_helpers.validateInputType)
    .then(_helpers.removeSpecialCharacters)
    .then(_helpers.validateInputLength)
    .then(_helpers.leftPadWithZeros)
    .then(_helpers.fetchCepFromServices)
    .catch(_helpers.handleServicesError)
    .catch(_helpers.throwApplicationError)
}

export { searchCEP };

export default searchCEP;
