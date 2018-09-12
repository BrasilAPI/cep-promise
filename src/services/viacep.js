'use strict'

import fetch from 'isomorphic-unfetch'
import { ResponseHelpers } from '../helpers/services-response-formatter';

const ViaCep = (cepWithLeftPad) => {
  const SERVICE_NAME = 'ViaCEP';
  const url = `https://viacep.com.br/ws/${cepWithLeftPad}/json/`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  }
  return fetch(url, options)
    .then((response) => ResponseHelpers.analyzeAndParseResponse(response, SERVICE_NAME))
    .then((response) => ResponseHelpers.checkForViaCepError(response, SERVICE_NAME))
    .then((response) => ResponseHelpers.extractCepValuesFromResponse(response, {
      cep: 'cep',
      state: 'uf',
      city: 'localidade',
      neighborhood: 'bairro',
      street: 'logradouro',
    }))
    .catch((e) => ResponseHelpers.throwApplicationError(e, SERVICE_NAME))
}

export { ViaCep };

export default ViaCep;
