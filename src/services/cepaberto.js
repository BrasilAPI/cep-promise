'use strict'

import fetch from 'isomorphic-unfetch'
import { ResponseHelpers } from '../helpers/services-response-formatter';

const CepAberto = (cepWithLeftPad, proxyURL = '') => {
  const SERVICE_NAME = 'CepAberto';
  const url = `${proxyURL}http://www.cepaberto.com/api/v2/ceps.json?cep=${cepWithLeftPad}`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'Authorization': 'Token token="37bfda18fd4b423cdb6748d14ba30aa6"'
    }
  }
  return fetch(url, options)
    .then((response) => ResponseHelpers.analyzeAndParseResponse(response, SERVICE_NAME))
    .then((response) => ResponseHelpers.checkForViaCepError(response, SERVICE_NAME))
    .then((response) => ResponseHelpers.extractCepValuesFromResponse(response, {
      cep: 'cep',
      state: 'estado',
      city: 'cidade',
      neighborhood: 'bairro',
      street: 'logradouro',
    }))
    .catch((e) => ResponseHelpers.throwApplicationError(e, SERVICE_NAME))
}

export { CepAberto };

export default CepAberto;
