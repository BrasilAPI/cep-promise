'use strict'

import xml2js from 'xml2js'
import _get from 'lodash.get'
import fetch from 'isomorphic-fetch'

const parseXMLString = xml2js.parseString

const CEP_SIZE = 8

function fetchCorreiosService (cepWithLeftPad) {
  const url = 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente'
  const options = {
    method: 'POST',
    body: '<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>' + cepWithLeftPad + '</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'cache-control': 'no-cache'
    }
  }
  return fetch(url, options)
    .then(parseResponse)
    .catch(throwError)
}

function parseResponse (response) {
  if (response.ok) {
    return response.text()
      .then(parseXML)
      .then(extractValuesFromSuccessResponse)
  }

  return response.text()
    .then(parseXML)
    .then(translateErrorMessage)
    .then(throwRangeError)
}

function parseXML (xmlString) {
  return new Promise((resolve, reject) => {
    parseXMLString(xmlString, (err, responseObject) => {
      if (!err) {
        resolve(responseObject)
      }
      throw new TypeError('Não foi possível interpretar o XML de resposta')
    })
  })
}

function translateErrorMessage (xmlObject) {
  let errorMessageFromCorreios = _get(xmlObject, 'soap:Envelope.soap:Body[0].soap:Fault[0].faultstring[0]')

  const dictionary = {
    'CEP NAO ENCONTRADO': 'CEP não encontrado na base dos Correios',
    'BUSCA DEFINIDA COMO EXATA, 0 CEP DEVE TER 8 DIGITOS': 'CEP deve conter exatamente ' + CEP_SIZE + ' caracteres'
  }

  return dictionary[errorMessageFromCorreios] || errorMessageFromCorreios
}

function throwRangeError (translatedErrorMessage) {
  throw new RangeError(translatedErrorMessage)
}

function extractValuesFromSuccessResponse (xmlObject) {
  let addressValues = _get(xmlObject, 'soap:Envelope.soap:Body[0].ns2:consultaCEPResponse[0].return[0]')

  return {
    cep: _get(addressValues, 'cep[0]'),
    state: _get(addressValues, 'uf[0]'),
    city: _get(addressValues, 'cidade[0]'),
    neighborhood: _get(addressValues, 'bairro[0]'),
    street: _get(addressValues, 'end[0]')
  }
}

function throwError (error) {
  if (error.name === 'FetchError') {
    error.message = 'Erro ao se conectar com o serviço dos Correios'
  }

  throw Object.assign(error, { service: 'correios' })
}

export default fetchCorreiosService
