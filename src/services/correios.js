'use strict'

import fetch from 'node-fetch'
import ServiceError from '../errors/service.js'

export default function fetchCorreiosService (cepWithLeftPad, proxyURL = '') {
  const url = `${proxyURL}https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente`
  const options = {
    method: 'POST',
    body: `<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>${cepWithLeftPad}</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>`,
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'cache-control': 'no-cache'
    }
  }

  return fetch(url, options)
    .then(analyzeAndParseResponse)
    .catch(throwApplicationError)
}

function analyzeAndParseResponse (response) {
  if (response.ok) {
    return response.text()
      .then(checkResponseAndResultStatement)
      .then(parseSuccessXML)
      .then(extractValuesFromSuccessResponse)
  }

  return response.text()
    .then(parseAndExtractErrorMessage)
    .then(throwCorreiosError)
}

function checkResponseAndResultStatement(xmlString) {
  if (xmlString.includes('consultaCEPResponse') && !xmlString.includes('<return>')) {
    throw new Error('CEP NAO ENCONTRADO')
  }

  return xmlString;
}

function parseSuccessXML(xmlString) {
  try {
    const returnStatement = xmlString.replace(/\r?\n|\r/g, '').match(/<return>(.*)<\/return>/)[0] ?? ''
    const cleanReturnStatement = returnStatement.replace('<return>', '').replace('</return>', '')
    const parsedReturnStatement = cleanReturnStatement
      .split(/</)
      .reduce((result, exp) => {
        const splittenExp = exp.split('>')
        if (splittenExp.length > 1 && splittenExp[1].length) {
          result[splittenExp[0]] = splittenExp[1]
        }
        return result
      }, {})

    return parsedReturnStatement
  } catch (e) {
    throw new Error('Não foi possível interpretar o XML de resposta.')
  }
}

function parseAndExtractErrorMessage (xmlString) {
  try {
    const returnStatement = xmlString.match(/<faultstring>(.*)<\/faultstring>/)[0] ?? ''
    const cleanReturnStatement = returnStatement.replace('<faultstring>', '').replace('</faultstring>', '')
    return cleanReturnStatement
  } catch (e) {
    throw new Error('Não foi possível interpretar o XML de resposta.')
  }
}

function throwCorreiosError (translatedErrorMessage) {
  throw new Error(translatedErrorMessage)
}

function extractValuesFromSuccessResponse (xmlObject) {
  return {
    cep: xmlObject.cep,
    state: xmlObject.uf,
    city: xmlObject.cidade,
    neighborhood: xmlObject.bairro,
    street: xmlObject.end,
    service: 'correios',
  }
}

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
