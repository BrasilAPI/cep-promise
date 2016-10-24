'use strict'

import xml2js from 'xml2js'
import _get from 'lodash.get'
import fetch from 'isomorphic-fetch'
import ServiceError from '../errors/service.js'

const parseXMLString = xml2js.parseString

function fetchCorreiosService (cepWithLeftPad) {

  return new Promise((resolve, reject) => {
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
      .then(analyzeAndParseResponse)
      .then(resolvePromise)
      .catch(rejectWithServiceError)


    function analyzeAndParseResponse (response) {
      if (response.ok) {
        return response.text()
          .then(parseXML)
          .then(extractValuesFromSuccessResponse)
      }

      return response.text()
        .then(parseXML)
        .then(extractErrorMessage)
        .then(throwError)
    }

    function parseXML (xmlString) {
      return new Promise((resolve, reject) => {
        parseXMLString(xmlString, (err, responseObject) => {
          if (!err) {
            resolve(responseObject)
          }

          throw new Error('Não foi possível interpretar o XML de resposta.')
        })
      })
    }

    function extractErrorMessage (xmlObject) {
      return _get(xmlObject, 'soap:Envelope.soap:Body[0].soap:Fault[0].faultstring[0]')
    }

    function throwError (translatedErrorMessage) {
      throw new Error(translatedErrorMessage)
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

    function resolvePromise (cepObject) {
      resolve(cepObject)
    }

    function rejectWithServiceError (error) {
      const serviceError = new ServiceError({
        message: error.message,
        service: 'correios'
      })

      if (error.name === 'FetchError') {
        serviceError.message = 'Erro ao se conectar com o serviço dos Correios.'
      }

      reject(serviceError)
    }

  })
}


export default fetchCorreiosService
