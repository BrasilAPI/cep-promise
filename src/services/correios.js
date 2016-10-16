'use strict'

import xml2js from 'xml2js'
import _get from 'lodash.get'
import request from 'request-promise'

const parseXMLString = xml2js.parseString

const CEP_SIZE = 8

function fetchCorreiosService (cepWithLeftPad) {
  const options = {
    method: 'POST',
    simple: false,
    uri: 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente',
    body: '<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>' + cepWithLeftPad + '</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'cache-control': 'no-cache'
    }
  }
  return request(options)
    .then(validateXmlResponse)
    .then(parseResponse)
    .then(extractValuesFromParsedResponse)
    .catch({message: 'CEP NAO ENCONTRADO'}, (err) => {
      throw Object.assign(err, {message: 'CEP não encontrado na base dos Correios'})
    })
    .catch({message: 'BUSCA DEFINIDA COMO EXATA, 0 CEP DEVE TER 8 DIGITOS'}, (err) => {
      throw Object.assign(err, {message: 'CEP deve conter exatamente ' + CEP_SIZE + ' caracteres'})
    })
    .catch((err) => {
      throw Object.assign(err, {service: 'correios'})
    })
}

function validateXmlResponse (response) {
  return new Promise((resolve, reject) => {
    parseXMLString(response, (err, xmlObject) => {
      let errorMessage = _get(xmlObject, 'soap:Envelope.soap:Body[0].soap:Fault[0].faultstring')
      if (errorMessage) {
        reject(new RangeError(errorMessage))
      }
      if (!err && _get(xmlObject, 'soap:Envelope.soap:Body[0].ns2:consultaCEPResponse[0].return[0]')) {
        resolve(response)
      }
      reject(err)
    })
  })
}

function parseResponse (responseString) {
  return new Promise((resolve, reject) => {
    parseXMLString(responseString, (err, responseObject) => {
      if (!err) {
        resolve(responseObject)
      }
      throw new TypeError('Não foi possível interpretar o XML de resposta')
    })
  })
}

function extractValuesFromParsedResponse (responseObject) {
  let addressValues = _get(responseObject, 'soap:Envelope.soap:Body[0].ns2:consultaCEPResponse[0].return[0]')
  return {
    cep: _get(addressValues, 'cep[0]'),
    state: _get(addressValues, 'uf[0]'),
    city: _get(addressValues, 'cidade[0]'),
    neighborhood: _get(addressValues, 'bairro[0]'),
    street: _get(addressValues, 'end[0]')
  }
}

export default fetchCorreiosService
