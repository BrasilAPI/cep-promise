'use strict'

import fetch from 'node-fetch'
import ServiceError from '../errors/service.js'

/**
 * @typedef {import('../cep-promise').CepPromiseConfigurations} CepPromiseConfigurations
 * @typedef {import('../cep-promise').CepResponse} CepResponse
 * @typedef {import('node-fetch').Response} FetchResponse
 * @typedef {import('./index').Provider} Provider
 */

/**
 * @param { string } cepWithLeftPad
 * @param { CepPromiseConfigurations } configurations
 * @returns { Promise<void | CepResponse> }
 */

export default function fetchCorreiosService (cepWithLeftPad, configurations) {
  const url = 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente'
  const options = {
    method: 'POST',
    body: `<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>${cepWithLeftPad}</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>`,
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'cache-control': 'no-cache'
    },
    timeout: configurations.timeout || 30000
  }

  return fetch(url, options)
    .then(analyzeAndParseResponse)
    .catch(throwApplicationError)
}


/**
 * @param { FetchResponse } response
 * @returns { Promise<void | CepResponse> }
 */
function analyzeAndParseResponse (response) {
  if (response && response.ok) {
    return response.text()
      .then(parseSuccessXML)
      .then(extractValuesFromSuccessResponse)
  }

  return response.text()
    .then(parseAndextractErrorMessage)
    .then(throwCorreiosError)
}

/**
 * 
 * @param { string } xmlString 
 * @returns { Object <string, any> }
 */
function parseSuccessXML (xmlString) {
  try {
    const returnStatement = xmlString.replace(/\r?\n|\r/g, '').match(/<return>(.*)<\/return>/)[0] ?? ''
    const cleanReturnStatement = returnStatement.replace('<return>', '').replace('</return>', '')
    const parsedReturnStatement = cleanReturnStatement
      .split(/</)

      .reduce(
        /**
         * @param { Object <string, any> } result
         * @param { string } exp
         * @returns { Object <string, any> }
         */
        (result, exp) => {
          const splittenExp = exp.split('>')
          if (splittenExp.length > 1 && splittenExp[1].length) {
            result[splittenExp[0]] = splittenExp[1]
          }
          return result
        }, {}
      )

    return parsedReturnStatement
  } catch (e) {
    throw new Error('Não foi possível interpretar o XML de resposta.')
  }
}

/**
 * 
 * @param { string } xmlString 
 * @returns { string } 
 */
function parseAndextractErrorMessage (xmlString) {
  try {
    const returnStatement = xmlString.match(/<faultstring>(.*)<\/faultstring>/)[0] ?? ''
    const cleanReturnStatement = returnStatement.replace('<faultstring>', '').replace('</faultstring>', '')
    return cleanReturnStatement
  } catch (e) {
    throw new Error('Não foi possível interpretar o XML de resposta.')
  }
}

/**
 * 
 * @param { string } translatedErrorMessage 
 * @returns { void }
 */
function throwCorreiosError (translatedErrorMessage) {
  throw new Error(translatedErrorMessage)
}

/**
 * 
 * @param { Object <string, any> } xmlObject 
 * @returns { CepResponse }
 */
function extractValuesFromSuccessResponse (xmlObject) {
  return {
    cep: xmlObject.cep,
    state: xmlObject.uf,
    city: xmlObject.cidade,
    neighborhood: xmlObject.bairro,
    street: xmlObject.end,
    service: 'correios'
  }
}

/**
 * 
 * @param { Error } error 
 */
function throwApplicationError (error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'correios'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço dos Correios.'
  }

  throw serviceError
}
